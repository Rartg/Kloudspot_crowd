import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthLoginComponent } from './component/loginp/loginp';
import { Dashboard } from './component/dashboard/dashboard';
import { CrowdEntries } from './component/crowd-entries/crowd-entries';
import { Sidebar } from './layouts/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Dashboard,CrowdEntries,Sidebar, AuthLoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Crowd Management System');
}
