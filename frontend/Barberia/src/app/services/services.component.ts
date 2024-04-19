import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  servicios = [
    { nombre: 'Servicio 1', descripcion: 'Descripción del servicio 1', imagen: 'assets/servicio1.jpg' },
    { nombre: 'Servicio 2', descripcion: 'Descripción del servicio 2', imagen: 'assets/servicio2.jpg' },
    { nombre: 'Servicio 3', descripcion: 'Descripción del servicio 3', imagen: 'assets/servicio3.jpg' },
    // Agrega más servicios según sea necesario
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
