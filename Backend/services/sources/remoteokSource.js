const axios = require('axios');

module.exports = {
    name: 'remoteok',
    async fetch() {
        const { data } = await axios.get('https://remoteok.com/api', {
            headers: { 'User-Agent': 'ai-job-radar' },
            timeout: 20000
        });
        return data
            .filter(j => j.id && j.position)          // first item is a legal notice
            .map(j => ({
                source: 'remoteok',
                external_id: String(j.id),
                title: j.position,
                company: j.company,
                location: j.location || 'Remote',
                is_remote: 1,
                category: 'REMOTE',
                description: j.description,
                url: j.url,
                salary: j.salary_min ? `${j.salary_min}-${j.salary_max}` : null,
                posted_at: j.date
            }));
    }
};