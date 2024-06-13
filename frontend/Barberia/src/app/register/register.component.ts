import { Component, ViewEncapsulation  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
  nombre: string = '';
  apellido: string = '';
  direccion: string = '';
  telefono: string = '';
  email: string = '';
  contrasenya: string = '';
  errorMessage: string = '';

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
    //Ruta para registrar usuario
    this.http.post('http://localhost:3000/register/register', userData).subscribe(
      (response: any) => {
        console.log('Registro exitoso:', response);
        this.router.navigate(['/login']); // Redirige al usuario al inicio de sesión despurs del registro
      },
      (error: any) => {
        console.error('Error en el registro:', error);
        if (error.status === 400) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Error en el registro. Por favor, intentelo de nuevo.';
        }
      }
    );
  }
}
