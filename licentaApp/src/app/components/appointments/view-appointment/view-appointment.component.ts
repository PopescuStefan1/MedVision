import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
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

  constructor(private appointmentService: AppointmentService, private medicService: MedicService) {}

  ngOnInit(): void {
    this.getAppointmentsForUser();
  }

  getAppointmentsForUser() {
    this.appointments$ = this.appointmentService.getAppointmentsByUserId(this.userId);
  }

  getMedicForAppointment(appointment: Appointment): Observable<Medic> {
    return this.medicService.getMedicById(appointment.medicId);
  }
}
