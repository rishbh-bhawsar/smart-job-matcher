const axios = require('axios');

module.exports = {
    name: 'adzuna',
    async fetch() {
        if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) return [];
        const country = process.env.ADZUNA_COUNTRY || 'in';
        const { data } = await axios.get(`https://api.adzuna.com/v1/api/jobs/${country}/search/1`, {
            params: {
                app_id: process.env.ADZUNA_APP_ID,
                app_key: process.env.ADZUNA_APP_KEY,
                what: 'developer',
                where: 'Indore',
                results_per_page: 50,
                max_days_old: 3
            },
            timeout: 20000
        });
        return data.results.map(j => ({
            source: 'adzuna',
            external_id: String(j.id),
            title: j.title,
            company: j.company?.display_name || 'Unknown',
            location: j.location?.display_name || 'Indore',
            is_remote: 0,
            category: 'INDORE',
            description: j.description,
            url: j.redirect_url,
            salary: j.salary_min ? String(Math.round(j.salary_min)) : null,
            posted_at: j.created
        }));
    }
};