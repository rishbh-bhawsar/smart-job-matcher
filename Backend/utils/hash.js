const crypto = require('crypto');

exports.jobHash = j =>
    crypto
        .createHash('sha256')
        .update(`${j.title}|${j.company}|${j.location}`.toLowerCase().trim())
        .digest('hex');