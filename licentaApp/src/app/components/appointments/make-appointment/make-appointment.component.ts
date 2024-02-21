import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { Observable } from "rxjs";
import { AppointmentService } from "src/app/services/appointment.service";

@Component({
  selector: "app-make-appointment",
  templateUrl: "./make-appointment.component.html",
  styleUrls: ["./make-appointment.component.css"],
})
export class MakeAppointmentComponent implements OnInit {
  newAppointmentForm!: FormGroup;
  initialFormValue: any;
  availableSpecialties$: Observable<string[]> = new Observable();
  cities$: Observable<string[]>;

  constructor(private appointmentService: AppointmentService, private formBuilder: FormBuilder) {
    this.cities$ = this.appointmentService.getDistinctCities();
  }

  ngOnInit(): void {
    this.createAppointmentForm();
  }

  createAppointmentForm() {
    this.newAppointmentForm = this.formBuilder.group({
      city: new FormControl(["", [Validators.required]]),
      specialty: new FormControl(["", [Validators.required]]),
    });

    this.initialFormValue = this.newAppointmentForm.value;
  }

  onCityChange(selection: MatSelectChange) {
    const selectedCity: string = selection.value;

    this.availableSpecialties$ = this.appointmentService.getSpecialtiesForCity(selectedCity);
  }

  onSubmit() {}
}
