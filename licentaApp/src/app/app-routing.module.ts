import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { MedicsComponent } from "./components/medics/medics.component";
import { AuthComponent } from "./components/auth/auth.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { ProfileGuard } from "./guards/profile.guard";
import { LoginauthGuard } from "./guards/loginauth.guard";
import { AppointmentsComponent } from "./components/appointments/appointments.component";
import { AppointmentsGuard } from "./guards/appointments.guard";
import { ScheduleComponent } from "./components/schedule/schedule.component";
import { ScheduleGuard } from "./guards/schedule.guard";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "authenticate", component: AuthComponent, canActivate: [LoginauthGuard] },
  { path: "medics", component: MedicsComponent },
  {
    path: "appointments/:city/:specialty/:medicId",
    component: AppointmentsComponent,
    canActivate: [AppointmentsGuard],
  },
  { path: "appointments", component: AppointmentsComponent, canActivate: [AppointmentsGuard] },
  { path: "schedule", component: ScheduleComponent, canActivate: [ScheduleGuard] },
  { path: "profile/:userId", component: UserProfileComponent, canActivate: [ProfileGuard] },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
