import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../auth/auth';

@Component({
  selector: 'app-auth-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './loginp.html',
  styleUrl: './loginp.scss',
})
export class AuthLoginComponent {

  // 👇 HTML-bound properties (DO NOT RENAME)
  email: string = '';
  password: string = '';
  spass: boolean = false;
  errorMessage = signal('');

  // 👇 Internals renamed
  private authService = inject(Auth);

  constructor(private navigationService: Router) {}

  // 👇 HTML calls this — keep name
  login(): void {
    this.executeAuthentication();
  }

  // 👇 Real logic moved here (renamed)
  private executeAuthentication(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Credentials are required');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (authResponse) => {
        this.authService.setToken(authResponse.token);
        this.navigationService.navigate(['/dashboard']);
        this.password = '';
      },
      error: (authError) => {
        console.error('Login process failed:', authError);

        if (authError.status === 401) {
          this.errorMessage.set('Invalid email or password');
        } else {
          this.errorMessage.set('Something went wrong. Try again.');
        }
      }
    });
  }

  // 👇 HTML calls this — keep name
  showpass(): void {
    this.togglePasswordState();
  }

  // 👇 Renamed internal method
  private togglePasswordState(): void {
    this.spass = !this.spass;
  }
}
