const db = require('../config/db');
const email = require('./emailService');

exports.createAndSend = async (jobIds, profile) => {
    if (!jobIds.length) return;

    const [jobs] = await db.query(
        `SELECT j.*, m.score, m.reason
     FROM jobs j JOIN job_matches m ON m.job_id = j.id
     WHERE j.id IN (?) ORDER BY m.score DESC`,
        [jobIds]
    );

    for (const id of jobIds) {
        await db.query('INSERT INTO notifications (job_id) VALUES (?)', [id]);
    }

    try {
        await email.sendDigest(process.env.NOTIFY_EMAIL || profile.email, jobs);
        await db.query(
            `UPDATE notifications SET status='SENT', sent_at=NOW() WHERE job_id IN (?) AND status='PENDING'`,
            [jobIds]
        );
        await db.query(
            `UPDATE user_jobs SET status='NOTIFIED', notified_at=NOW() WHERE job_id IN (?) AND status='NEW'`,
            [jobIds]
        );
    } catch (e) {
        console.error('[notify] email failed:', e.message);
        await db.query(
            `UPDATE notifications SET status='FAILED', error=? WHERE job_id IN (?) AND status='PENDING'`,
            [e.message, jobIds]
        );
    }
};