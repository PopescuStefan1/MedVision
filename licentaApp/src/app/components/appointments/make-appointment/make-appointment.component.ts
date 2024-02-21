import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-make-appointment",
  templateUrl: "./make-appointment.component.html",
  styleUrls: ["./make-appointment.component.css"],
})
export class MakeAppointmentComponent implements OnInit {
  newAppointmentForm!: FormGroup;
  availableSpecialties: string[] = [];

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {}
}
