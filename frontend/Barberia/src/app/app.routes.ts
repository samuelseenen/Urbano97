import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BookingComponent } from './booking/booking.component';
import { ServicesComponent } from './services/services.component';
import { FullCalendarModule } from '@fullcalendar/angular';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'services', component: ServicesComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes),
    FullCalendarModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export { routes };