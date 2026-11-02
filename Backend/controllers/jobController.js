const jobModel = require('../models/jobModel');

const STATUSES = ['NEW', 'NOTIFIED', 'APPLIED', 'IGNORED'];

exports.list = async (req, res) => {
    const { category, status, minScore } = req.query;
    res.json(await jobModel.list({ category, status, minScore: parseInt(minScore) || 0 }));
};

exports.updateStatus = async (req, res) => {
    const { status } = req.body;
    if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    await jobModel.setStatus(req.params.id, status);
    res.json({ ok: true });
};