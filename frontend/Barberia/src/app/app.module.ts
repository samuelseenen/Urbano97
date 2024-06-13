// Se importan modulos y componentes creados
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { ChangeCredentialsComponent } from './change-credentials/change-credentials.component';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './auth.service';  // Importa el servicio de autenticación
import { AuthGuard } from './auth.guard';  // Importa el guard de autenticación
import { AppRoutingModule } from './app.routes';  // Importa el módulo de rutas

@NgModule({
  declarations: [
    //Se declaran los componentes
    AppComponent,
    LoginComponent,
    BookingComponent,
    HomeComponent,
    ServicesComponent,
    QrScannerComponent,
    NavbarComponent,
    RegisterComponent,
    ReservationsComponent,
    ChangeCredentialsComponent,
    FooterComponent
  ],
  imports: [
    //Se importan los modulos
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    HttpClientModule,
    AppRoutingModule,
    CalendarModule.forRoot({
      provide: 'locale',
      useValue: 'es'
    }),
    ZXingScannerModule
  ],
  providers: [
    provideAnimationsAsync(),
    //Se añaden los servicios de autenticacion
    AuthService,  
    AuthGuard  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
