import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReservationsComponent implements OnInit {
  reservations: any[] = [];
  userEmail: string = '';

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    // Obtener el correo electronico del usuario logueado
    this.authService.currentUserEmail$.pipe(take(1)).subscribe(email => {
      this.userEmail = email ?? '';
      
      // Hacer una solicitud HTTP al backend para obtener las reservas del usuario
      this.http.get<any[]>('http://localhost:3000/watch-reservations', { params: { email: this.userEmail } }).subscribe(
        (data) => {
          this.reservations = data;
        },
        (error) => {
          console.error('Error al obtener las reservas:', error);
        }
      );
    });
  }

  cancelReservation(fecha: string, hora: string, clientId: string) {
    // Hacer una solicitud HTTP al backend para cancelar la reserva
    this.http.delete('http://localhost:3000/cancel-reservation/cancel-reservation', { params: { email: this.userEmail, fecha: fecha, hora: hora, clientId: clientId } }).subscribe(
      (response) => {
        console.log('Reserva cancelada:', response);
        // Actualizar las reservas después de cancelar
        this.updateReservations();
      },
      (error) => {
        console.error('Error al cancelar la reserva:', error);
      }
    );
  }
  
  updateReservations(): void {
    // Actualizar las reservas después de cancelar
    this.http.get<any[]>('http://localhost:3000/watch-reservations', { params: { email: this.userEmail } }).subscribe(
      (data) => {
        this.reservations = data;
      },
      (error) => {
        console.error('Error al obtener las reservas después de cancelar:', error);
      }
    );
  }
}
