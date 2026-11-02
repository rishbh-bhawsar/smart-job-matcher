import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Job, JobStatus, AppNotification, Profile } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private base = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getJobs(filters: { category?: string; status?: string; minScore?: number }) {
        let params = new HttpParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params = params.set(key, String(value));
            }
        });
        return this.http.get<Job[]>(`${this.base}/jobs`, { params });
    }

    setStatus(id: number, status: JobStatus) {
        return this.http.patch<{ ok: boolean }>(`${this.base}/jobs/${id}/status`, { status });
    }

    getNotifications() {
        return this.http.get<AppNotification[]>(`${this.base}/notifications`);
    }

    markRead(id: number) {
        return this.http.patch(`${this.base}/notifications/${id}/read`, {});
    }

    runSync() {
        return this.http.post<{ fetched: number; matched: number }>(`${this.base}/sync/run`, {});
    }

    getProfile() {
        return this.http.get<Profile>(`${this.base}/profile`);
    }

    saveProfile(profile: Profile) {
        return this.http.put(`${this.base}/profile`, profile);
    }
}