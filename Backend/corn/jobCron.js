const cron = require('node-cron');
const sync = require('../services/jobSyncService');

module.exports = () => {
    if (process.env.CRON_ENABLED !== 'true') {
        console.log('[cron] disabled');
        return;
    }
    const schedule = process.env.CRON_SCHEDULE || '0 * * * *';

    cron.schedule(schedule, async () => {
        try {
            console.log('[cron] result:', await sync.run());
        } catch (e) {
            console.error('[cron] failed:', e.message);
        }
    });
    console.log(`[cron] scheduled: ${schedule}`);
};