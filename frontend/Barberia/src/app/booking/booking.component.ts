import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {

  selectedDate: string = ''; 
  selectedHour: string = ''; 
  selectedBarber: any = null; 
  selectedService: string = ''; 
  availableHours: string[] = []; 
  availableBarbers: any[] = []; 
  showBarbers: boolean = false; 
  showReservationButton: boolean = false; 
  showConfirmation: boolean = false; 
  noHoursAvailableMessage: string = ''; // Inicializa con una cadena vacía

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: []
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  handleDateClick(arg: any) {
    this.selectedDate = arg.dateStr;
    this.initAvailableBarbers(this.selectedDate);
  }

  initAvailableBarbers(date: string): void {
    const [year, month, day] = date.split('-');
    this.http.get<any[]>(`http://localhost:3000/booking/barbers/${year}/${month}/${day}`).subscribe(
      (barbersResults) => {
        this.availableBarbers = barbersResults;
        this.showBarbers = true;
      },
      (error) => {
        console.error('Error obteniendo peluqueros:', error);
      }
    );
  }

  selectBarber(barber: any): void {
    this.selectedBarber = barber;
    this.showBarbers = false; 
    this.initAvailableHours(this.selectedBarber.id, this.selectedDate);
  }

  initAvailableHours(barberId: number, date: string): void {
    this.http.get<any | { message: string }>(`http://localhost:3000/booking/barber/${barberId}/${date}`).subscribe(
      (response) => {
        if ('message' in response) {
          // Si la respuesta tiene la propiedad 'message', significa que no hay horas disponibles
          this.noHoursAvailableMessage = response.message;
          this.availableHours = []; // Vaciar las horas disponibles
        } else {
          // Si no tiene 'message', significa que hay horas disponibles
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

  makeReservation(): void {
    if (!this.selectedDate || !this.selectedHour || !this.selectedBarber) {
      console.error('Error: Se deben seleccionar una fecha, una hora y un peluquero para hacer la reserva');
      return;
    }

    const barberId = this.selectedBarber.id;
    const formattedDate = this.selectedDate;
    const hour = this.selectedHour;
    const clientId = 1;

    const reservationData = {
      clientId: clientId,
      barberId: barberId,
      date: formattedDate,
      hour: hour
    };

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
    location.reload();
  }
}
