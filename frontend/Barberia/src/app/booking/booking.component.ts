import { Component } from '@angular/core';
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

  selectedDate: string = ''; // Variable para almacenar la fecha seleccionada
  selectedHour: string = ''; // Variable para almacenar la hora seleccionada
  selectedBarber: any = null; // Variable para almacenar el peluquero seleccionado
  selectedService: string = ''; // Variable para almacenar el servicio seleccionado
  availableHours: string[] = []; // Variable para almacenar las horas disponibles
  availableBarbers: any[] = []; // Variable para almacenar los peluqueros disponibles
  showBarbers: boolean = false; // Variable de bandera para mostrar u ocultar los peluqueros
  showReservationButton: boolean = false; // Variable de bandera para mostrar u ocultar el botón "Hacer Reserva"

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: []
  };

  constructor(private http: HttpClient) {}

  handleDateClick(arg: any) {
    this.selectedDate = arg.dateStr;
    this.initAvailableBarbers(this.selectedDate);
  }

  initAvailableBarbers(date: string): void {
    const [year, month, day] = date.split('-');
    this.http.get<any[]>(`http://localhost:3000/booking/barbers/${year}/${month}/${day}`).subscribe(
      (barbersResults) => {
        this.availableBarbers = barbersResults;
        this.showBarbers = true; // Mostrar los peluqueros disponibles
      },
      (error) => {
        console.error('Error obteniendo peluqueros:', error);
      }
    );
  }

  selectBarber(barber: any): void {
    this.selectedBarber = barber;
    this.showBarbers = false; // Ocultar los peluqueros al seleccionar uno
    this.initAvailableHours(this.selectedBarber.id, this.selectedDate);
  }

  initAvailableHours(barberId: number, date: string): void {
    this.http.get<any[]>(`http://localhost:3000/booking/barber/${barberId}/${date}`).subscribe(
      (allHoursResults) => {
        this.availableHours = allHoursResults;
      },
      (error) => {
        console.error('Error obteniendo horas disponibles:', error);
      }
    );
  }

  selectHour(hour: string): void {
    this.selectedHour = hour;
    this.showReservationButton = true; // Mostrar el botón "Hacer Reserva" al seleccionar una hora
  }

  selectService(service: string): void {
    this.selectedService = service;
    // Aquí puedes manejar la selección del servicio
    console.log('Servicio seleccionado:', service);
  }

  makeReservation(): void {
    // Lógica para hacer la reserva
    console.log('Reserva realizada para:', this.selectedDate, this.selectedHour, this.selectedBarber);
  }

}
