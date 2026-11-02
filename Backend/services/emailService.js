const mailer = require('../config/mailer');

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

exports.sendDigest = (to, jobs) =>
    mailer.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: `${jobs.length} new matching job${jobs.length > 1 ? 's' : ''}`,
        html: jobs
            .map(
                j => `
        <p>
          <b>${esc(j.title)}</b> - ${esc(j.company)} (${esc(j.location)})<br>
          Match: ${esc(j.score)}% - ${esc(j.reason)}<br>
          <a href="${esc(j.url)}">Open job</a>
        </p>`
            )
            .join('<hr>')
    });