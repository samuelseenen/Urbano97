// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  login() {
    const body = { email: this.email, password: this.password };
    this.http.post('http://localhost:3000/login', body).subscribe((res: any) => {
      console.log(res);
      if (res.message === 'Login successful') {
        this.authService.login(this.email);
        this.router.navigateByUrl('/home');
      } else {
        console.error('Error:', res.message);
      }
    }, (error) => {
      console.error('Error:', error);
    });
  }
}
