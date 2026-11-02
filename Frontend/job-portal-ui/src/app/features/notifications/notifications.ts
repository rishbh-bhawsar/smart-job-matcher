import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { AppNotification } from '../../core/models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css']
})
export class NotificationsComponent implements OnInit {
  items: AppNotification[] = [];
  loading = true;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getNotifications().subscribe({
      next: list => {
        this.items = list;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  read(n: AppNotification) {
    this.api.markRead(n.id).subscribe(() => (n.is_read = 1));
  }
}