const sync = require('../services/jobSyncService');

exports.run = async (req, res) => res.json(await sync.run());