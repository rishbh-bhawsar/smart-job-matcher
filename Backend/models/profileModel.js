const db = require('../config/db');

exports.get = async () => {
    const [rows] = await db.query('SELECT * FROM profiles ORDER BY id LIMIT 1');
    const p = rows[0];
    if (!p) return null;
    p.skills = p.skills || [];
    p.target_titles = p.target_titles || [];
    return p;
};

exports.update = async d => {
    const p = await exports.get();
    await db.query(
        `UPDATE profiles SET name=?, email=?, resume_text=?, skills=?, target_titles=?, min_score=? WHERE id=?`,
        [d.name, d.email, d.resume_text, JSON.stringify(d.skills || []),
        JSON.stringify(d.target_titles || []), d.min_score ?? 70, p.id]
    );
};