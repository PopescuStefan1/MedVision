import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { AppointmentService } from "src/app/services/appointment.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-appointments",
  templateUrl: "./appointments.component.html",
  styleUrls: ["./appointments.component.css"],
})
export class AppointmentsComponent implements OnInit {
  userId: string = "";
  selected = new FormControl(0);

  constructor(private authService: AuthService, private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.getUserId();

    this.appointmentService.addAppointment$.subscribe(() => {
      this.selected.setValue(1);
    });
  }

  private getUserId() {
    this.authService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });
  }
}
