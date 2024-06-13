import { Component, ViewEncapsulation  } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showErrorAnimation: boolean = false;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  login() {
    const body = { email: this.email, password: this.password };
    this.http.post('http://localhost:3000/login', body).subscribe((res: any) => {
      console.log(res);
      if (res.message === 'Login successful') {
        this.authService.login(this.email, res.tipoUsuario); // Pasa el tipoUsuario al servicio
        this.router.navigateByUrl('/home');
      } else {
        this.errorMessage = 'Credenciales incorrectas';
        this.showErrorAnimation = true;
        console.error('Error:', res.message);
      }
    }, (error) => {
      this.errorMessage = 'Credenciales incorrectas';
      this.showErrorAnimation = true;
      console.error('Error:', error);
    });
  }
}
