const db = require('../config/db');

exports.list = async () => {
    const [rows] = await db.query(
        `SELECT n.*, j.title, j.company
     FROM notifications n JOIN jobs j ON j.id = n.job_id
     ORDER BY n.created_at DESC LIMIT 100`
    );
    return rows;
};

exports.markRead = async id => {
    await db.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
};