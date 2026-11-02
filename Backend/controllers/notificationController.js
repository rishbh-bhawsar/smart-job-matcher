const notificationModel = require('../models/notificationModel');

exports.list = async (req, res) => res.json(await notificationModel.list());

exports.read = async (req, res) => {
    await notificationModel.markRead(req.params.id);
    res.json({ ok: true });
};