import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BookingComponent } from './booking/booking.component';
import { ServicesComponent } from './services/services.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AuthGuard } from './auth.guard';  // Importa el guard de autenticación

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },  // Protege esta ruta con el guard
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuard] },  // Protege esta ruta con el guard
  { path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },  // Protege esta ruta con el guard
  { path: 'qr-scanner', component: QrScannerComponent, canActivate: [AuthGuard] },  // Protege esta ruta con el guard
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FullCalendarModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export { routes };
