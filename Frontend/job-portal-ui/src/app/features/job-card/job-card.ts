import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreBadgeComponent } from '../../shared/score-badge/score-badge';
import { Job } from '../../core/models';

@Component({
  imports: [CommonModule, ScoreBadgeComponent],
  selector: 'app-job-card',
  styleUrl: './job-card.css',
  templateUrl: './job-card.html',
  standalone: true
})
export class JobCardComponent {
  @Input({ required: true }) job!: Job;
  @Output() applied = new EventEmitter<Job>();
  @Output() ignored = new EventEmitter<Job>();
}
