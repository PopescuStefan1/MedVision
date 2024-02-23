import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { Observable } from "rxjs";
import { AppointmentService } from "src/app/services/appointment.service";

@Component({
  selector: "app-make-appointment",
  templateUrl: "./make-appointment.component.html",
  styleUrls: ["./make-appointment.component.css"],
})
export class MakeAppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  initialFormValue: any;
  availableSpecialties$: Observable<string[]> = new Observable();
  cities$: Observable<string[]>;

  constructor(private appointmentService: AppointmentService, private formBuilder: FormBuilder) {
    this.cities$ = this.appointmentService.getDistinctCities();
  }

  ngOnInit(): void {
    this.createAppointmentForm();

    this.cities$.subscribe((cities) => {
      const cityControl = this.appointmentForm.get("city");
      cityControl?.setValidators([Validators.required, this.optionsValidator(cities)]);
      cityControl?.updateValueAndValidity();
    });
  }

  optionsValidator(options: any[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (Validators.required(control) !== null) {
        // If required validation fails, return null (indicating the required validation error)
        return null;
      }

      const selectedValue = control.value;
      if (!options.includes(selectedValue)) {
        return { oneOf: true }; // Custom error key to indicate oneOf validation failure
      }

      return null;
    };
  }

  createAppointmentForm() {
    this.appointmentForm = this.formBuilder.group({
      city: new FormControl(["", { validators: [], asyncValidators: [Validators.required] }]),
      specialty: new FormControl(["", [Validators.required]]),
    });

    this.initialFormValue = this.appointmentForm.value;
  }

  onCityChange(selection: MatSelectChange) {
    const selectedCity: string = selection.value;

    this.availableSpecialties$ = this.appointmentService.getSpecialtiesForCity(selectedCity);

    this.availableSpecialties$.subscribe((specialties) => {
      const specialtyControl = this.appointmentForm.get("specialty");
      specialtyControl?.setValidators([Validators.required, this.optionsValidator(specialties)]);
      specialtyControl?.updateValueAndValidity();
    });
  }

  onSubmit() {}
}
