//Se importan los modulos de angular
import { Component, ChangeDetectorRef, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthService } from '../auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BookingComponent {
  selectedDate: string = ''; 
  selectedHour: string = ''; 
  selectedBarber: any = null; 
  selectedService: string = ''; 
  availableHours: string[] = []; 
  availableBarbers: any[] = []; 
  showBarbers: boolean = false; 
  showHours: boolean = false;
  showReservationButton: boolean = false; 
  showConfirmation: boolean = false; 
  noHoursAvailableMessage: string = '';
  userEmail: string = ''; 
//Creacion del calendario
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [],
    validRange: { start: new Date() } // Deshabilitar dias anteriores al día actual
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private authService: AuthService) {
    // Obtener el email del usuario del servicio AuthService
    this.authService.currentUserEmail$.pipe(take(1)).subscribe(email => {
      this.userEmail = email ?? '';
    });
  }

  handleDateClick(arg: any) {
    const selectedDate = new Date(arg.dateStr);
    const currentDate = new Date(); // Obtener la fecha actual
    
    // Verificar si la fecha seleccionada es anterior al día actual
    if (selectedDate < currentDate) {
      return; // No hacer nada si la fecha seleccionada es anterior al día actual
    }

    this.selectedDate = arg.dateStr;
    this.calendarOptions.events = [];
    this.initAvailableBarbers();
  }
  
  initAvailableBarbers(): void {
    const [year, month, day] = this.selectedDate.split('-'); // Obtener año, mes y día del string de fecha seleccionada
    console.log('Fetching barbers for date:', this.selectedDate);
    //Ruta para ver peluqueros disponibles
    this.http.get<any[]>(`http://localhost:3000/booking/barbers/${year}/${month}/${day}`).subscribe(
      (barbersResults) => {
        this.availableBarbers = barbersResults;
        console.log('Available barbers:', this.availableBarbers);
        if (this.availableBarbers.length > 0) {
          this.showBarbers = true;
        }
      },
      (error) => {
        console.error('Error obteniendo peluqueros:', error);
      }
    );
  }
  
  selectBarber(barber: any): void {
    this.selectedBarber = barber;
    this.showBarbers = false; 
    this.showHours = true;
    this.initAvailableHours();
  }

  initAvailableHours(): void {
    const barberId = this.selectedBarber.id;
    this.http.get<any | { message: string }>(`http://localhost:3000/booking/barber/${barberId}/${this.selectedDate}`).subscribe(
      (response) => {
        if ('message' in response) {
          this.noHoursAvailableMessage = response.message;
          this.availableHours = [];
        } else {
          this.availableHours = response;
        }
      },
      (error) => {
        console.error('Error obteniendo horas disponibles:', error);
      }
    );
  }

  selectHour(hour: string): void {
    this.selectedHour = hour;
    this.showReservationButton = true; 
  }

  selectService(service: string): void {
    this.selectedService = service;
    console.log('Servicio seleccionado:', service);
  }

  makeReservation(event: MouseEvent): void {
    event.preventDefault();

    if (!this.selectedDate || !this.selectedHour || !this.selectedBarber) {
      console.error('Error: Se deben seleccionar una fecha, una hora y un peluquero para hacer la reserva');
      return;
    }

    const barberId = this.selectedBarber.id;
    const formattedDate = this.selectedDate;
    const hour = this.selectedHour;
    const email = this.userEmail;
    const reservationData = {
      email: email,
      barberId: barberId,
      date: formattedDate,
      hour: hour
    };
    //Solicitud para hacer reserva
    this.http.post<any>('http://localhost:3000/reserva/reservation', reservationData).subscribe(
      (response) => {
        console.log('Reserva realizada con éxito:', response.message);
        this.showConfirmation = true; 
        this.cdr.detectChanges(); 
      },
      (error) => {
        console.error('Error al hacer la reserva:', error);
      }
    );
  }

  acceptConfirmation(): void {
    this.showConfirmation = false; // Ocultar el mensaje de confirmación
  }
}


