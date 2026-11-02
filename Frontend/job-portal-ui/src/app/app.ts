import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from './core/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit, OnDestroy {
  unread = 0;
  dark = false;
  private timer: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    const saved = localStorage.getItem('theme');
    this.dark = saved
      ? saved === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme();

    this.loadUnread();
    this.timer = setInterval(() => this.loadUnread(), 60000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  loadUnread() {
    this.api.getNotifications().subscribe({
      next: list => (this.unread = list.filter(n => !n.is_read).length),
      error: () => { }
    });
  }

  toggleTheme() {
    this.dark = !this.dark;
    localStorage.setItem('theme', this.dark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    document.documentElement.setAttribute('data-theme', this.dark ? 'dark' : 'light');
  }

}
