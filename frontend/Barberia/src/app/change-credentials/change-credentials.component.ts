import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-change-credentials',
  templateUrl: './change-credentials.component.html',
  styleUrls: ['./change-credentials.component.css']
})
export class ChangeCredentialsComponent implements OnInit {
  currentPassword: string = '';
  currentEmail: string = '';
  newEmail: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isPasswordVerified: boolean = false;
  showEmailForm: boolean = false;
  showPasswordForm: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    // Obtener el correo electronico del usuario logueado
    this.authService.currentUserEmail$.subscribe(email => {
      this.currentEmail = email || '';
    });
  }

  verifyCurrentPassword(): void {
    const verifyData = {
      email: this.currentEmail,
      password: this.currentPassword
    };

    this.http.post('http://localhost:3000/change-credentials/verify-password', verifyData).subscribe(
      (response: any) => {
        if (response.success) {
          this.isPasswordVerified = true;
          this.errorMessage = '';
        } else {
          this.errorMessage = 'Contraseña incorrecta.';
        }
      },
      (error) => {
        console.error('Error verificando la contraseña:', error);
        this.errorMessage = 'Error verificando la contraseña.';
      }
    );
  }

  showChangeEmailForm(): void {
    this.showEmailForm = true;
    this.showPasswordForm = false;
  }

  showChangePasswordForm(): void {
    this.showEmailForm = false;
    this.showPasswordForm = true;
  }

  changeEmail(): void {
    const emailData = {
      currentEmail: this.currentEmail,
      newEmail: this.newEmail
    };
    //Solicitud para el cambio de email
    this.http.post('http://localhost:3000/change-credentials/change-email', emailData).subscribe(
      (response: any) => {
        if (response.success) {
          this.successMessage = 'Correo cambiado exitosamente.';
          this.errorMessage = '';
          this.authService.updateUserEmail(this.newEmail); // Actualizar el correo en AuthService
        } else {
          this.errorMessage = 'Error al cambiar el correo.';
        }
      },
      (error) => {
        console.error('Error al cambiar el correo:', error);
        this.errorMessage = 'Error al cambiar el correo.';
      }
    );
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const passwordData = {
      email: this.currentEmail,
      newPassword: this.newPassword
    };
    //Solicitud para el cambio de contraseña
    this.http.post('http://localhost:3000/change-credentials/change-password', passwordData).subscribe(
      (response: any) => {
        if (response.success) {
          this.successMessage = 'Contraseña cambiada exitosamente.';
          this.errorMessage = '';
        } else {
          this.errorMessage = 'Error al cambiar la contraseña.';
        }
      },
      (error) => {
        console.error('Error al cambiar la contraseña:', error);
        this.errorMessage = 'Error al cambiar la contraseña.';
      }
    );
  }
}
