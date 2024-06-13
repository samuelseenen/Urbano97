//Se agregan las rutas de los componentes
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BookingComponent } from './booking/booking.component';
import { ServicesComponent } from './services/services.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AuthGuard } from './auth.guard';  // Importa el guard de autenticación
import { RegisterComponent } from './register/register.component';
import { ReservationsComponent } from './reservations/reservations.component'; // Importa el componente de Reservations
import { ChangeCredentialsComponent } from './change-credentials/change-credentials.component'; // Importa el componente de Reservations

const routes: Routes = [
  //Se declaran las rutas con sus respectivos nombres para que luego puedan ser llamadas
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, // Protege esta ruta con el guard 
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },
  { path: 'qr-scanner', component: QrScannerComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'reservations', component: ReservationsComponent, canActivate: [AuthGuard] },
  { path: 'change-credentials', component: ChangeCredentialsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FullCalendarModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export { routes };
