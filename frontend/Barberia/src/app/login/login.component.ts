import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = ''; // Propiedad para almacenar el correo electrónico
  password: string = ''; // Propiedad para almacenar la contraseña

  constructor(private router: Router, private http: HttpClient) { }

  login() {
    const body = { email: this.email, password: this.password }; // Utiliza los valores de las propiedades email y password
    this.http.post('http://localhost:3000/login', body).subscribe((res) => {
      console.log(res);
      this.router.navigateByUrl('/home');
    }, (error) => {
      console.error('Error:', error);
    });
  }
}
