const db = require('../config/db');
const { jobHash } = require('../utils/hash');

const toDate = v => {
    const d = v ? new Date(v) : null;
    return d && !isNaN(d) ? d : null;
};

// returns the new job id, or null when the job already exists
exports.insertIfNew = async j => {
    const [r] = await db.query(
        `INSERT IGNORE INTO jobs
     (source, external_id, title, company, location, is_remote, category,
      description, url, salary, posted_at, dedupe_hash)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
            j.source, String(j.external_id || '').slice(0, 500), j.title, j.company, j.location || '',
            j.is_remote ? 1 : 0, j.category, j.description || '', j.url,
            j.salary ? String(j.salary).slice(0, 100) : null, toDate(j.posted_at), jobHash(j)
        ]
    );
    if (r.affectedRows === 0) return null;
    await db.query('INSERT INTO user_jobs (job_id) VALUES (?)', [r.insertId]);
    return r.insertId;
};

exports.getByIds = async ids => {
    if (!ids.length) return [];
    const [rows] = await db.query('SELECT * FROM jobs WHERE id IN (?)', [ids]);
    return rows;
};

exports.list = async ({ category, status, minScore = 0 }) => {
    let sql = `
    SELECT j.*, m.score, m.reason, m.matched_skills, m.missing_skills, u.status, u.applied_at
    FROM jobs j
    JOIN job_matches m ON m.job_id = j.id
    JOIN user_jobs u ON u.job_id = j.id
    WHERE m.score >= ?`;
    const params = [minScore];

    if (category) { sql += ' AND j.category = ?'; params.push(category); }

    if (status === 'NOT_APPLIED') sql += " AND u.status IN ('NEW','NOTIFIED')";
    else if (status) { sql += ' AND u.status = ?'; params.push(status); }

    sql += ' ORDER BY m.score DESC, j.fetched_at DESC LIMIT 200';
    const [rows] = await db.query(sql, params);
    return rows;
};

exports.setStatus = async (jobId, status) => {
    await db.query(
        `UPDATE user_jobs
     SET status = ?, applied_at = IF(? = 'APPLIED', NOW(), NULL)
     WHERE job_id = ?`,
        [status, status, jobId]
    );
};