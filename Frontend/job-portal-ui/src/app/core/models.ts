export type JobStatus = 'NEW' | 'NOTIFIED' | 'APPLIED' | 'IGNORED';

export interface Job {
    id: number;
    source: string;
    title: string;
    company: string;
    location: string;
    is_remote: number;
    category: 'INDORE' | 'REMOTE';
    description: string;
    url: string;
    salary: string | null;
    posted_at: string | null;
    fetched_at: string;
    score: number;
    reason: string;
    matched_skills: string[];
    missing_skills: string[];
    status: JobStatus;
    applied_at: string | null;
}

export interface AppNotification {
    id: number;
    job_id: number;
    title: string;
    company: string;
    status: string;
    is_read: number;
    created_at: string;
}

export interface Profile {
    name: string;
    email: string;
    resume_text: string;
    skills: string[];
    target_titles: string[];
    min_score: number;
}