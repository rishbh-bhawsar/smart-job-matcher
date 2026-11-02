const openai = require('../config/openai');

exports.scoreJobs = async (profile, jobs) => {
    const results = [];

    for (let i = 0; i < jobs.length; i += 5) {                 // 5 jobs per request
        const batch = jobs.slice(i, i + 5).map(j => ({
            id: j.id,
            title: j.title,
            company: j.company,
            location: j.location,
            description: (j.description || '').replace(/<[^>]+>/g, ' ').slice(0, 2500)
        }));

        try {
            const res = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL,
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'system',
                        content:
                            'You match job postings to a candidate. Return JSON exactly like: ' +
                            '{"results":[{"id":number,"score":0-100,"reason":string,' +
                            '"matched_skills":string[],"missing_skills":string[]}]}. ' +
                            'Score using skills overlap, seniority fit from the resume, and role relevance. ' +
                            'Keep each reason under 25 words. Return one result per job id.'
                    },
                    {
                        role: 'user',
                        content: JSON.stringify({
                            candidate: {
                                skills: profile.skills,
                                target_titles: profile.target_titles,
                                resume: profile.resume_text
                            },
                            jobs: batch
                        })
                    }
                ]
            });
            const parsed = JSON.parse(res.choices[0].message.content);
            results.push(...(parsed.results || []));
        } catch (e) {
            console.error('[ai] batch failed:', e.message);       // one bad batch must not stop the run
        }
    }
    return results;
};