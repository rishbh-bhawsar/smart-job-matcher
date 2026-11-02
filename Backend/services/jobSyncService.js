const jobModel = require('../models/jobModel');
const profileModel = require('../models/profileModel');
const matchModel = require('../models/matchModel');
const ai = require('./aiMatchService');
const notify = require('./notificationService');

const sources = [
    require('./sources/remotiveSource'),
    require('./sources/remoteokSource'),
    require('./sources/adzunaSource'),
    require('./sources/emailAlertSource')
];

const TITLE_RE = /(developer|engineer|full.?stack|angular|node|frontend|front-end|backend|software)/i;
let running = false;

exports.isRunning = () => running;

exports.run = async () => {
    if (running) throw Object.assign(new Error('Sync already running'), { status: 409 });
    running = true;

    try {
        const profile = await profileModel.get();
        if (!profile) throw new Error('No profile row found. Run sql/schema.sql');

        const newIds = [];

        for (const source of sources) {
            try {
                const jobs = await source.fetch();
                for (const j of jobs) {
                    if (!TITLE_RE.test(j.title || '')) continue;
                    if (j.category === 'INDORE' && !/indore/i.test(j.location || '') && !j.is_remote) continue;
                    const id = await jobModel.insertIfNew(j);
                    if (id) newIds.push(id);
                }
                console.log(`[sync] ${source.name}: ${jobs.length} fetched`);
            } catch (e) {
                console.error(`[sync] ${source.name} failed:`, e.message);   // one source failing must not stop the rest
            }
        }

        const newJobs = await jobModel.getByIds(newIds);
        if (!newJobs.length) return { fetched: 0, matched: 0 };

        const scores = await ai.scoreJobs(profile, newJobs);
        await matchModel.saveMany(profile.id, scores);

        const threshold = profile.min_score ?? 70;
        const good = scores.filter(s => s.score >= threshold).map(s => s.id);
        await notify.createAndSend(good, profile);

        return { fetched: newJobs.length, matched: good.length };
    } finally {
        running = false;
    }
};