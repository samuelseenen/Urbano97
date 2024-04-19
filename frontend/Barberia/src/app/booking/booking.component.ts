import { Component } from '@angular/core';
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
  selectedService: string = ''; // Variable para almacenar el servicio seleccionado
  availableHours: string[] = []; // Variable para almacenar las horas disponibles
  showReservationButton: boolean = false; // Variable de bandera para mostrar u ocultar el botón "Hacer Reserva"

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: []
  };

  constructor() {}

  handleDateClick(arg: any) {
    this.selectedDate = arg.dateStr;
    this.initAvailableHours(this.selectedDate);
  }

  initAvailableHours(date: string): void {
    // Lógica para calcular las horas disponibles para la fecha seleccionada (date)
    // Aquí puedes rellenar el array availableHours con las horas disponibles
    // Este es solo un ejemplo
    this.availableHours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
  }

  selectHour(hour: string): void {
    this.selectedHour = hour;
    this.showReservationButton = false; // Oculta el botón "Hacer Reserva" al seleccionar una nueva hora
    // Aquí puedes llamar a la función para cargar los servicios disponibles
    // basándote en la hora seleccionada (this.selectedHour)
  }

  selectService(service: string): void {
    this.selectedService = service;
    this.showReservationButton = true; // Muestra el botón "Hacer Reserva" al seleccionar un servicio
    // Aquí puedes manejar la selección del servicio
    console.log('Servicio seleccionado:', service);
  }

  makeReservation(): void {
    // Lógica para hacer la reserva
    console.log('Reserva realizada para:', this.selectedDate, this.selectedHour, this.selectedService);
  }

}
