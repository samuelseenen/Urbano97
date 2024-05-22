import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'; // Importa RouterModule y Routes para definir las rutas
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BookingComponent } from './booking/booking.component';
import { HomeComponent } from './home/home.component'; 
import { ServicesComponent } from './services/services.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ZXingScannerModule } from '@zxing/ngx-scanner';



// Define las rutas de la aplicación
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'booking', component: BookingComponent }, // Agrega esta ruta para el componente de reserva
  { path: 'services', component: ServicesComponent }, // Agrega esta ruta para el componente de reserva
  { path: 'qr-scanner', component: QrScannerComponent } // Agrega esta ruta para el componente de reserva
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BookingComponent,
    HomeComponent,
    ServicesComponent,
    QrScannerComponent // Asegúrate de incluir HomeComponent en las declaraciones si lo estás usando
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FullCalendarModule,
    HttpClientModule,
    RouterModule.forRoot(routes), // Importa las rutas definidas anteriormente
    CalendarModule.forRoot({
      provide: 'locale',
      useValue: 'es'
    }),
    ZXingScannerModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
