import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { Observable } from "rxjs";
import { Medic } from "src/app/models/medic";
import { AppointmentService } from "src/app/services/appointment.service";

@Component({
  selector: "app-make-appointment",
  templateUrl: "./make-appointment.component.html",
  styleUrls: ["./make-appointment.component.css"],
})
export class MakeAppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  initialFormValue: any;
  cities$: Observable<string[]>;
  availableSpecialties$: Observable<string[]> = new Observable();
  availableMedics$: Observable<Medic[]> = new Observable();

  constructor(private appointmentService: AppointmentService, private formBuilder: FormBuilder) {
    this.cities$ = this.appointmentService.getDistinctCities();
  }

  ngOnInit(): void {
    this.createAppointmentForm();
  }

  private createAppointmentForm() {
    this.appointmentForm = this.formBuilder.group({
      city: ["", [Validators.required]],
      specialty: ["", [Validators.required]],
      medic: ["", [Validators.required]],
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      telephone: ["", [Validators.required, Validators.pattern("^0[23467](\\d){8}$")]],
    });

    this.initialFormValue = this.appointmentForm.value;
  }

  onCityChange(selection: MatSelectChange) {
    const selectedCity: string = selection.value;

    this.availableSpecialties$ = this.appointmentService.getSpecialtiesForCity(selectedCity);

    // Update specialty validators after changing city
    this.availableSpecialties$.subscribe((specialties) => {
      const specialtyControl = this.appointmentForm.get("specialty");

      specialtyControl?.setValue("");
      specialtyControl?.setValidators([Validators.required, this.optionsValidator(specialties)]);
      specialtyControl?.updateValueAndValidity();
    });

    // Reset medics
    this.availableMedics$ = new Observable();
  }

  onSpecialtyChange(selection: MatSelectChange) {
    const selectedCity: string = this.appointmentForm.get("city")?.value;
    const selectedSpecialty: string = selection.value;

    this.availableMedics$ = this.appointmentService.getMedicsForCityAndSpecialty(selectedCity, selectedSpecialty);

    // Update medic validators after changing specialty
    this.availableMedics$.subscribe((medics) => {
      const medicIds = medics.map((medic) => medic.id);

      const medicControl = this.appointmentForm.get("medic");
      medicControl?.setValidators([Validators.required, this.optionsValidator(medicIds)]);
      medicControl?.updateValueAndValidity();
    });
  }

  asdf(selection: MatSelectChange) {
    console.log(selection.value);
  }

  private optionsValidator(options: any[]): ValidatorFn {
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

  onSubmit() {}
}
