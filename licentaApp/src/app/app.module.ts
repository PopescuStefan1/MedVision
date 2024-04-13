import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { environment } from "src/environments/environment";

import { MaterialModule } from "src/material.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HomeComponent } from "./components/home/home.component";
import { MedicsComponent } from "./components/medics/medics.component";
import { CarouselComponent } from "./components/home/carousel/carousel.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AuthComponent } from "./components/auth/auth.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { ErrorStateMatcher, MAT_DATE_LOCALE, ShowOnDirtyErrorStateMatcher } from "@angular/material/core";
import { AppointmentsComponent } from "./components/appointments/appointments.component";
import { MakeAppointmentComponent } from "./components/appointments/make-appointment/make-appointment.component";
import { ViewAppointmentComponent } from "./components/appointments/view-appointment/view-appointment.component";
import { ScheduleComponent } from "./components/schedule/schedule.component";
import { ScheduleTableComponent } from "./components/schedule/schedule-table/schedule-table.component";
import { DatePipe } from "@angular/common";
import { ScheduleDetailsComponent } from "./components/schedule/schedule-details/schedule-details.component";
import { MedicProfileComponent } from "./components/medics/medic-profile/medic-profile.component";
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { AIPhotoCheckComponent } from './components/ai-photo-check/ai-photo-check.component';
import { FileDragNDropDirectiveDirective } from './directives/file-drag-ndrop-directive.directive';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    MedicsComponent,
    CarouselComponent,
    FooterComponent,
    AuthComponent,
    UserProfileComponent,
    AppointmentsComponent,
    MakeAppointmentComponent,
    ViewAppointmentComponent,
    ScheduleComponent,
    ScheduleTableComponent,
    ScheduleDetailsComponent,
    MedicProfileComponent,
    NotAuthorizedComponent,
    ContactComponent,
    AboutComponent,
    AIPhotoCheckComponent,
    FileDragNDropDirectiveDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
