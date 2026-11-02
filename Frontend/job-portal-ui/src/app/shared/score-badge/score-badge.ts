import { Component, Input } from '@angular/core';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-score-badge',
  styleUrl: './score-badge.css',
  templateUrl: './score-badge.html',
})
export class ScoreBadgeComponent {
  @Input() score = 0;

  get level() {
    return this.score >= 80 ? 'badge high' : this.score >= 70 ? 'badge mid' : 'badge low';
  }
}
