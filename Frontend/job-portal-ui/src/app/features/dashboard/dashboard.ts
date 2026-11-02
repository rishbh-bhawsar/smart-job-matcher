import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Job, JobStatus } from '../../core/models';
import { JobCardComponent } from '../job-card/job-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, JobCardComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  category: 'INDORE' | 'REMOTE' = 'INDORE';
  status = 'NOT_APPLIED';
  minScore = 70;
  search = '';
  sort: 'score' | 'new' = 'score';

  jobs: Job[] = [];
  loading = false;
  error = '';
  message = '';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.load();
  }

  setCategory(c: 'INDORE' | 'REMOTE') {
    this.category = c;
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';
    this.api
      .getJobs({ category: this.category, status: this.status, minScore: this.minScore })
      .subscribe({
        next: jobs => {
          this.jobs = jobs;
          this.loading = false;
        },
        error: () => {
          this.error = 'Cannot load jobs. Is the backend running?';
          this.loading = false;
        }
      });
  }

  get visible(): Job[] {
    const q = this.search.toLowerCase().trim();
    const list = this.jobs.filter(
      j => !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)
    );
    return [...list].sort((a, b) =>
      this.sort === 'score'
        ? b.score - a.score
        : new Date(b.fetched_at).getTime() - new Date(a.fetched_at).getTime()
    );
  }

  changeStatus(job: Job, status: JobStatus) {
    const before = this.jobs;

    // update screen first (fast), roll back if the API fails
    if (this.status === 'NOT_APPLIED') {
      this.jobs = this.jobs.filter(j => j.id !== job.id);
    } else {
      this.jobs = this.jobs.map(j => (j.id === job.id ? { ...j, status } : j));
    }

    this.api.setStatus(job.id, status).subscribe({
      next: () => this.showMessage(status === 'APPLIED' ? 'Marked as applied' : 'Job ignored'),
      error: () => {
        this.jobs = before;
        this.showMessage('Could not update. Try again.');
      }
    });
  }

  syncNow() {
    this.showMessage('Syncing...');
    this.api.runSync().subscribe({
      next: r => {
        this.showMessage(`${r.fetched} new jobs, ${r.matched} matched`);
        this.load();
      },
      error: () => this.showMessage('Sync failed')
    });
  }

  showMessage(text: string) {
    this.message = text;
    setTimeout(() => (this.message = ''), 3000);
  }

  trackById(_: number, job: Job) {
    return job.id;
  }
}