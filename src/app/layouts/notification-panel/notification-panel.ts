import { Component, inject } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { Socketservices } from '../../services/socketservices';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-panel',
  imports: [CommonModule],
  templateUrl: './notification-panel.html',
  styleUrl: './notification-panel.scss',
})
export class NotificationPanel {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  soc = inject(Socketservices)

}
