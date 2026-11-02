const profileModel = require('../models/profileModel');

exports.get = async (req, res) => res.json(await profileModel.get());

exports.update = async (req, res) => {
    await profileModel.update(req.body);
    res.json({ ok: true });
};