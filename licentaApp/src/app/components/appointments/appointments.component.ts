import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-appointments",
  templateUrl: "./appointments.component.html",
  styleUrls: ["./appointments.component.css"],
})
export class AppointmentsComponent implements OnInit {
  userId: string = "";

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getUserId();
  }

  private getUserId() {
    this.authService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });
  }
}
