import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  model:any ={
  name:"",
  email: '',
  resumeText : '',
  skillsText : '',
  titlesText : '',
  minScore : 70  
  }
  message:string ="";

  constructor(private api: ApiService,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.api.getProfile().subscribe(p => {
      this.model.name = p.name;
      this.model.email = p.email;
      this.model.resumeText = p.resume_text;
      this.model.skillsText = (p.skills || []).join(', ');
      this.model.titlesText = (p.target_titles || []).join(', ');
      this.model.minScore = p.min_score;
      this.cdr.detectChanges();            
    });
  }

  private split(text: string): string[] {
    return text.split(',').map(s => s.trim()).filter(Boolean);
  }

  save() {
    this.api
      .saveProfile({
        name: this.model.name,
        email: this.model.email,
        resume_text: this.model.resumeText,
        skills: this.split(this.model.skillsText),
        target_titles: this.split(this.model.titlesText),
        min_score: this.model.minScore
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