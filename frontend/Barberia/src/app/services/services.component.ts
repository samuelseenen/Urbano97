import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  servicios = [
    {
      nombre: 'Corte Clasico',
      descripcion: 'Adecuado para hombres que quieren lucir bien pero aun asi estar prolijos',
      imagen: 'path_to_image/haircut.png',
      precio: 20
    },
    {
      nombre: 'Corte de Lujo',
      descripcion: 'Adecuado para hombres que quieren lucir bien pero aun asi estar prolijos',
      imagen: 'path_to_image/deluxe_haircut.png',
      precio: 40
    },
    {
      nombre: 'Corte para Ninos',
      descripcion: 'Adecuado para hombres que quieren lucir bien pero aun asi estar prolijos',
      imagen: 'path_to_image/kids_haircut.png',
      precio: 15
    },
    {
      nombre: 'Recorte de Barba',
      descripcion: 'Adecuado para hombres que quieren lucir bien pero aun asi estar prolijos',
      imagen: 'path_to_image/beard_trim.png',
      precio: 15
    },
    {
      nombre: 'Afeitado con Toalla Caliente',
      descripcion: 'Adecuado para hombres que quieren lucir bien pero aun asi estar prolijos',
      imagen: 'path_to_image/hot_towel_shave.png',
      precio: 30
    },
    {
      nombre: 'Recorte de Bigote',
      descripcion: 'Adecuado para hombres que quieren lucir bien pero aun asi estar prolijos',
      imagen: 'path_to_image/mustache_trim.png',
      precio: 15
    },
    {
      nombre: 'Color de Cabello',
      descripcion: 'Adecuado para hombres que quieren lucir bien pero aun asi estar prolijos',
      imagen: 'path_to_image/hair_color.png',
      precio: 15
    },
    {
      nombre: 'Facial',
      descripcion: 'Adecuado para hombres que quieren lucir bien pero aun asi estar prolijos',
      imagen: 'path_to_image/face_facial.png',
      precio: 15
    },
    {
      nombre: 'Lavado de Cabello',
      descripcion: 'Adecuado para hombres que quieren lucir bien pero aun asi estar prolijos',
      imagen: 'path_to_image/hair_wash.png',
      precio: 10
    }
  ];
}
