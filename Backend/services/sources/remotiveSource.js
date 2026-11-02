const axios = require('axios');

module.exports = {
    name: 'remotive',
    async fetch() {
        const { data } = await axios.get('https://remotive.com/api/remote-jobs?category=software-dev', { timeout: 20000 });
        return data.jobs.map(j => ({
            source: 'remotive',
            external_id: String(j.id),
            title: j.title,
            company: j.company_name,
            location: j.candidate_required_location || 'Remote',
            is_remote: 1,
            category: 'REMOTE',
            description: j.description,
            url: j.url,
            salary: j.salary,
            posted_at: j.publication_date
        }));
    }
};