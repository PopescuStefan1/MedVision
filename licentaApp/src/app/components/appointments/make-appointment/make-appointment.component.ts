import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatSelectChange } from "@angular/material/select";
import { Observable, map } from "rxjs";
import { AppointmentTime } from "src/app/models/appointment-time";
import { Medic } from "src/app/models/medic";
import { AppointmentService } from "src/app/services/appointment.service";

@Component({
  selector: "app-make-appointment",
  templateUrl: "./make-appointment.component.html",
  styleUrls: ["./make-appointment.component.css"],
})
export class MakeAppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  formLoaded: boolean = false;
  initialFormValue: any;
  cities$: Observable<string[]>;
  availableSpecialties$: Observable<string[]> = new Observable();
  availableMedics$: Observable<Medic[]> = new Observable();
  availableTimes$: Observable<any> = new Observable();

  freeDaysFilter = (date: Date | null): boolean => {
    if (date === null) {
      return false;
    }

    const isWeekDay: boolean = date.getDay() !== 0 && date.getDay() !== 6;
    const isInFuture: boolean =
      date.getDate() > new Date().getDate() ||
      date.getMonth() > new Date().getMonth() ||
      date.getFullYear() > new Date().getFullYear();

    return isWeekDay && isInFuture;
  };

  constructor(private appointmentService: AppointmentService, private formBuilder: FormBuilder) {
    this.cities$ = this.appointmentService.getDistinctCities();
  }

  ngOnInit(): void {
    this.formLoaded = false;
    this.createAppointmentForm();
    this.formLoaded = true;
  }

  private createAppointmentForm() {
    this.appointmentForm = this.formBuilder.group({
      city: ["", [Validators.required]],
      specialty: ["", [Validators.required]],
      medic: ["", [Validators.required]],
      dateTime: this.formBuilder.group({
        date: ["", [Validators.required]],
        time: ["", [Validators.required]],
      }),
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      telephone: ["", [Validators.required, Validators.pattern("^0[23467](\\d){8}$")]],
      email: ["", [Validators.required, Validators.email]],
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

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate: Date | null = event.value;
    if (selectedDate) {
      const allTimes: AppointmentTime[] = [];
      for (let hour: number = 8; hour < 16; hour++) {
        for (let minute: number = 0; minute < 60; minute += 20) {
          const time = new Date(selectedDate);
          time.setHours(hour);
          time.setMinutes(minute);
          time.setSeconds(0);
          time.setMilliseconds(0);

          allTimes.push({ time: time, disabled: false });
        }
      }

      const medicId = this.appointmentForm.get("medic")?.value;
      this.availableTimes$ = this.appointmentService.getMedicAppointmentBookedTimes(medicId, selectedDate).pipe(
        map((bookedTimes) => {
          allTimes.forEach((time) => {
            bookedTimes.forEach((bookedTime) => {
              if (time.time.toISOString() === bookedTime.toISOString()) {
                time.disabled = true;
              }
            });
          });

          return allTimes;
        })
      );

      this.availableTimes$.subscribe((times) => {
        console.log(times);
      });
    }
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
