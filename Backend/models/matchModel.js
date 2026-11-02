const db = require('../config/db');

exports.saveMany = async (profileId, scores) => {
    for (const s of scores) {
        await db.query(
            `INSERT INTO job_matches (job_id, profile_id, score, reason, matched_skills, missing_skills)
       VALUES (?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE score=VALUES(score), reason=VALUES(reason),
         matched_skills=VALUES(matched_skills), missing_skills=VALUES(missing_skills)`,
            [
                s.id, profileId, Math.max(0, Math.min(100, Math.round(s.score || 0))),
                s.reason || '', JSON.stringify(s.matched_skills || []), JSON.stringify(s.missing_skills || [])
            ]
        );
    }
};