import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MedicsComponent } from './components/medics/medics.component';
import { AuthComponent } from './components/auth/auth.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfileGuard } from './guards/profile.guard';
import { LoginauthGuard } from './guards/loginauth.guard';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { AppointmentsGuard } from './guards/appointments.guard';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ScheduleGuard } from './guards/schedule.guard';
import { MedicProfileComponent } from './components/medics/medic-profile/medic-profile.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { MedicPageGuard } from './guards/medic-page.guard';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { AIPhotoCheckComponent } from './components/ai-photo-check/ai-photo-check.component';

const routes: Routes = [
  { path: '', title: 'MedVision - Home', component: HomeComponent },
  {
    path: 'authenticate',
    title: 'MedVision - Authenticate',
    component: AuthComponent,
    canActivate: [LoginauthGuard],
  },
  {
    path: 'medics',
    title: 'MedVision - Medics',
    component: MedicsComponent,
  },
  {
    path: 'medic-page/:userId',
    title: 'MedVision - Set up your medic page',
    component: MedicProfileComponent,
    canActivate: [MedicPageGuard],
  },
  {
    path: 'medic-page',
    redirectTo: 'medic-page/ ',
  },
  {
    path: 'appointments/:city/:specialty/:medicId',
    title: 'MedVision - Appointments',
    component: AppointmentsComponent,
    canActivate: [AppointmentsGuard],
  },
  {
    path: 'appointments',
    title: 'MedVision - Appointments',
    component: AppointmentsComponent,
    canActivate: [AppointmentsGuard],
  },
  {
    path: 'schedule',
    title: 'MedVision - Medic Schedule',
    component: ScheduleComponent,
    canActivate: [ScheduleGuard],
  },
  {
    path: 'profile/:userId',
    title: 'MedVision - User Profile',
    component: UserProfileComponent,
    canActivate: [ProfileGuard],
  },
  { path: 'profile', redirectTo: 'profile/ ' },
  {
    path: 'contact',
    title: 'MedVision - Contact',
    component: ContactComponent,
  },
  { path: 'about', title: 'MedVision - About', component: AboutComponent },
  {
    path: 'ai-photo-check',
    title: 'MedVision - Skin Lesion Analyser',
    component: AIPhotoCheckComponent,
    canActivate: [AppointmentsGuard],
  },
  {
    path: 'not-authorized',
    title: 'MedVision - Unauthorized Access',
    component: NotAuthorizedComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
