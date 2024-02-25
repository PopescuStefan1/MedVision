import { Component, Input, OnInit } from "@angular/core";
import { Observable, filter, map, switchMap } from "rxjs";
import { Appointment } from "src/app/models/appointment";
import { Medic } from "src/app/models/medic";
import { AppointmentService } from "src/app/services/appointment.service";
import { MedicService } from "src/app/services/medic.service";

@Component({
  selector: "app-view-appointment",
  templateUrl: "./view-appointment.component.html",
  styleUrls: ["./view-appointment.component.css"],
})
export class ViewAppointmentComponent implements OnInit {
  @Input() userId: string = "";
  appointments$: Observable<Appointment[]> = new Observable();
  pastAppointments$: Observable<Appointment[]> = new Observable();
  futureAppointments$: Observable<Appointment[]> = new Observable();
  medics: Medic[] = [];

  constructor(private appointmentService: AppointmentService, private medicService: MedicService) {}

  ngOnInit(): void {
    this.getAppointmentsForUser();
    this.getMedicsForAppointments();
  }

  getAppointmentsForUser(): void {
    this.appointments$ = this.appointmentService.getAppointmentsByUserId(this.userId);

    this.pastAppointments$ = this.appointments$.pipe(
      map((appointments) => appointments.filter((appointment) => appointment.datetime < new Date()))
    );
    this.futureAppointments$ = this.appointments$.pipe(
      map((appointments) => appointments.filter((appointment) => appointment.datetime >= new Date()))
    );
  }

  getMedicsForAppointments(): void {
    this.appointments$
      .pipe(
        switchMap((appointments) => {
          const medicIds: string[] = appointments.map((appointment) => appointment.medicId);
          return this.medicService.getMedicsById(medicIds);
        })
      )
      .subscribe((medics) => {
        this.medics = medics;
      });
  }

  getMedicById(medicId: string): Medic | undefined {
    return this.medics.find((medic) => medic.id === medicId);
  }
}
