import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre: string = '';
  apellido: string = '';
  direccion: string = '';
  telefono: string = '';
  email: string = '';
  contrasenya: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const userData = {
      Nombre: this.nombre,
      Apellido: this.apellido,
      Direccion: this.direccion,
      Telefono: this.telefono,
      Email: this.email,
      Contrasenya: this.contrasenya
    };

    this.http.post('http://localhost:3000/register/register', userData).subscribe(
      (response: any) => {
        console.log('Registro exitoso:', response);
        this.router.navigate(['/login']); // Redirige al usuario al inicio de sesión después del registro
      },
      (error: any) => {
        console.error('Error en el registro:', error);
      }
    );
  }
}
