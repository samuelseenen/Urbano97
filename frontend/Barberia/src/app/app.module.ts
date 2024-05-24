import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarModule } from 'angular-calendar';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BookingComponent } from './booking/booking.component';
import { HomeComponent } from './home/home.component'; 
import { ServicesComponent } from './services/services.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { NavbarComponent } from './navbar/navbar.component';  // Importa el nuevo componente de navbar
import { RegisterComponent } from './register/register.component'; // Importa el componente de registro
import { ReservationsComponent } from './reservations/reservations.component'; // Importa el componente de reservaciones

import { AuthService } from './auth.service';  // Importa el servicio de autenticación
import { AuthGuard } from './auth.guard';  // Importa el guard de autenticación
import { AppRoutingModule } from './app.routes';  // Importa el módulo de rutas

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BookingComponent,
    HomeComponent,
    ServicesComponent,
    QrScannerComponent,
    NavbarComponent,  // Declara el nuevo componente de navbar
    RegisterComponent,
    ReservationsComponent // Declara el componente de registro
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, // Añade ReactiveFormsModule
    FullCalendarModule,
    HttpClientModule,
    AppRoutingModule,  // Importa el módulo de rutas
    CalendarModule.forRoot({
      provide: 'locale',
      useValue: 'es'
    }),
    ZXingScannerModule
  ],
  providers: [
    provideAnimationsAsync(),
    AuthService,  // Provee el servicio de autenticación
    AuthGuard  // Provee el guard de autenticación
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
