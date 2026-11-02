require('dotenv').config();

const required = [
    'DB_HOST', 'DB_USER', 'DB_NAME',
    'OPENAI_API_KEY', 'OPENAI_MODEL',
    'SMTP_USER', 'SMTP_PASS', 'API_KEY'
];

const missing = required.filter(k => !process.env[k]);
if (missing.length) {
    console.error('Missing env vars:', missing.join(', '));
    process.exit(1);
}

module.exports = process.env;