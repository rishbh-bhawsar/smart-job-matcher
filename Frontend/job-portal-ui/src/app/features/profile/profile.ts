import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  name = '';
  email = '';
  resumeText = '';
  skillsText = '';
  titlesText = '';
  minScore = 70;
  message = '';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getProfile().subscribe(p => {
      this.name = p.name;
      this.email = p.email;
      this.resumeText = p.resume_text;
      this.skillsText = (p.skills || []).join(', ');
      this.titlesText = (p.target_titles || []).join(', ');
      this.minScore = p.min_score;
    });
  }

  private split(text: string): string[] {
    return text.split(',').map(s => s.trim()).filter(Boolean);
  }

  save() {
    this.api
      .saveProfile({
        name: this.name,
        email: this.email,
        resume_text: this.resumeText,
        skills: this.split(this.skillsText),
        target_titles: this.split(this.titlesText),
        min_score: this.minScore
      })
      .subscribe({
        next: () => this.show('Profile saved'),
        error: () => this.show('Save failed')
      });
  }

  show(text: string) {
    this.message = text;
    setTimeout(() => (this.message = ''), 3000);
  }
}