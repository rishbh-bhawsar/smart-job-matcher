const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const db = require('../../config/db');
const openai = require('../../config/openai');

async function extractJobs(html) {
    const res = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content:
                    'Extract job listings from this job-alert email. Return JSON: ' +
                    '{"jobs":[{"title":string,"company":string,"location":string,"url":string,"salary":string|null}]}. ' +
                    'Only real job postings. Use the exact URL found in the email.'
            },
            { role: 'user', content: html.slice(0, 20000) }
        ]
    });
    return JSON.parse(res.choices[0].message.content).jobs || [];
}

module.exports = {
    name: 'email-alerts',
    async fetch() {
        if (!process.env.IMAP_USER || !process.env.IMAP_PASS) return [];

        const senders = (process.env.ALERT_SENDERS || '').split(',').map(s => s.trim()).filter(Boolean);
        const since = new Date(Date.now() - (+process.env.ALERT_LOOKBACK_HOURS || 24) * 3600 * 1000);

        const imap = new ImapFlow({
            host: process.env.IMAP_HOST,
            port: +process.env.IMAP_PORT || 993,
            secure: true,
            auth: { user: process.env.IMAP_USER, pass: process.env.IMAP_PASS },
            logger: false
        });

        const out = [];
        await imap.connect();
        const lock = await imap.getMailboxLock(process.env.IMAP_LABEL || process.env.IMAP_MAILBOX || 'INBOX');

        try {
            for (const sender of senders) {
                const seqs = await imap.search({ from: sender, since });
                for (const seq of seqs.slice(-20)) {                 // at most 20 mails per sender per run
                    const msg = await imap.fetchOne(seq, { source: true });
                    const mail = await simpleParser(msg.source);
                    const messageId = mail.messageId || `${sender}-${seq}-${mail.date}`;

                    const [seen] = await db.query('SELECT 1 FROM processed_emails WHERE message_id = ?', [messageId]);
                    if (seen.length) continue;

                    const jobs = await extractJobs(mail.html || mail.text || '');
                    for (const j of jobs) {
                        if (!j.title || !j.url) continue;
                        const text = `${j.title} ${j.location || ''}`;
                        const isIndore = /indore/i.test(text);
                        const isRemote = /remote/i.test(text);
                        if (!isIndore && !isRemote) continue;              // ignore other cities

                        out.push({
                            source: sender.split('.')[0],
                            external_id: j.url,
                            title: j.title,
                            company: j.company || 'Unknown',
                            location: j.location || '',
                            is_remote: isRemote ? 1 : 0,
                            category: isIndore ? 'INDORE' : 'REMOTE',
                            description: `${j.title} at ${j.company}, ${j.location}`,
                            url: j.url,
                            salary: j.salary,
                            posted_at: mail.date
                        });
                    }
                    await db.query('INSERT IGNORE INTO processed_emails (message_id) VALUES (?)', [messageId]);
                }
            }
        } finally {
            lock.release();
            await imap.logout();
        }
        return out;
    }
};