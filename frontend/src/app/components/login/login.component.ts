import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(public auth : AuthService, private router : Router) {

  }

  loginWithRedirect(): void {
    this.auth.loginWithRedirect().subscribe({
      complete: () => this.router.navigate(['/home']),
      error: (err) => console.error('Login error', err),
    });
  }

}
