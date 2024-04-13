import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatSelectChange } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription, map, switchMap } from "rxjs";
import { Appointment } from "src/app/models/appointment";
import { AppointmentTime } from "src/app/models/appointment-time";
import { Medic } from "src/app/models/medic";
import { UserProfile } from "src/app/models/user-profile";
import { AppointmentService } from "src/app/services/appointment.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-make-appointment",
  templateUrl: "./make-appointment.component.html",
  styleUrls: ["./make-appointment.component.css"],
})
export class MakeAppointmentComponent implements OnInit, OnDestroy {
  @Input() userId: string = "";
  city?: string;
  specialty?: string;
  medicId?: string;

  appointmentForm!: FormGroup;
  formLoaded: boolean = false;
  initialFormValue: any;
  cities$: Observable<string[]> = new Observable();
  availableSpecialties$: Observable<string[]> = new Observable();
  availableMedics$: Observable<Medic[]> = new Observable();
  availableTimes$: Observable<any> = new Observable();
  fromDate: Date | undefined;
  isLoadingAppointmentAdd: boolean = false;
  hasProfileInfo: boolean = false;
  userData?: UserProfile;
  profileSub: Subscription = new Subscription();

  imageUrl: string = "";
  imageUploaded: boolean = false;
  uploadedFile?: File;

  constructor(
    private appointmentService: AppointmentService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private userService: UserService
  ) {
    this.cities$ = this.appointmentService.getDistinctCities();
  }

  ngOnInit(): void {
    this.formLoaded = false;
    this.getRouteParams();

    this.profileSub = this.userService.getUserData(this.userId).subscribe((userData) => {
      if (userData.firstName) {
        // If the profile has been filled by the user enable autofill button
        this.hasProfileInfo = true;
        this.userData = userData;
      }
      this.createAppointmentForm();

      if (this.city && this.specialty && this.medicId) {
        this.autoFillWithRouteParams();
      } else {
        this.formLoaded = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.profileSub.unsubscribe();
  }

  private getRouteParams() {
    this.route.queryParams.subscribe((params) => {
      this.city = params["city"];
      this.specialty = params["specialty"];
      this.medicId = params["medicId"];
    });
  }

  private autoFillWithRouteParams() {
    this.cities$
      .pipe(
        switchMap(() => {
          this.availableSpecialties$ = this.appointmentService.getSpecialtiesForCity(this.city!);
          return this.availableSpecialties$;
        }),
        switchMap(() => {
          this.availableMedics$ = this.appointmentService.getMedicsForCityAndSpecialty(this.city!, this.specialty!);
          return this.availableMedics$;
        })
      )
      .subscribe(() => {
        this.appointmentForm.get("city")?.setValue(this.city);
        this.appointmentForm.get("specialty")?.setValue(this.specialty);
        this.appointmentForm.get("medic")?.setValue(this.medicId);

        this.formLoaded = true;
      });
  }

  private createAppointmentForm() {
    this.appointmentForm = this.formBuilder.group({
      city: ["", [Validators.required]],
      specialty: ["", [Validators.required]],
      medic: ["", [Validators.required]],
      datetime: this.formBuilder.group({
        date: ["", [Validators.required]],
        time: ["", [Validators.required]],
      }),
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      age: ["", [Validators.required]],
      sex: ["", [Validators.required]],
      telephone: ["", [Validators.required, Validators.pattern("^[23467](\\d){8}$")]],
      email: ["", [Validators.required, Validators.email]],
      comment: [""],
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

  onMedicChange(selection: MatSelectChange) {
    // Reset date and time fields
    this.fromDate = undefined;
    this.availableTimes$ = new Observable();
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

      // Update time validators after changing date
      this.availableTimes$.subscribe((times: AppointmentTime[]) => {
        const timeSlots = times.map((time) => time.time);
        const timeControl = this.appointmentForm.get("dateTime")?.get("time");
        timeControl?.setValidators([Validators.required, this.optionsValidator(timeSlots)]);
        timeControl?.updateValueAndValidity();
      });
    }
  }

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

  onSubmit() {
    if (this.appointmentForm.valid) {
      this.isLoadingAppointmentAdd = true;

      const appointmentData = this.appointmentForm.value;
      const appointment: Appointment = {
        city: appointmentData.city,
        datetime: appointmentData.datetime.time,
        email: appointmentData.email,
        firstName: appointmentData.firstName,
        lastName: appointmentData.lastName,
        age: appointmentData.age,
        sex: appointmentData.sex,
        telephone: appointmentData.telephone,
        medicId: appointmentData.medic,
        userId: this.userId,
        comment: appointmentData.comment,
      };

      if (this.imageUploaded && this.uploadedFile) {
        this.appointmentService
          // Upload image
          .uploadImage(this.uploadedFile, "appointment-images")
          .pipe(
            switchMap((url) => {
              console.log("After upload image");
              // After upload, add the img url to the appointment
              appointment.imgUrl = url;

              // Add appointment to db
              return this.appointmentService.addApointment(appointment);
            })
          )
          .subscribe({
            next: () => {
              console.log("After add appointment");

              this.appointmentForm.reset();
              this.openSnackBar("Successfully created your appointment.");
            },
            error: (error) => {
              this.openSnackBar(`An error occured ${error}`);
            },
            complete: () => {
              this.isLoadingAppointmentAdd = false;
            },
          });
      } else {
        this.appointmentService.addApointment(appointment).subscribe({
          next: () => {
            this.appointmentForm.reset();
            this.openSnackBar("Successfully created your appointment.");
          },
          error: (error) => {
            this.openSnackBar(`An error occured ${error}`);
          },
          complete: () => {
            this.isLoadingAppointmentAdd = false;
          },
        });
      }
    }
  }

  // private handleImageUpload(): void {
  //   if (this.imageUploaded && this.uploadedFile) {
  //     this.medicService
  //       .uploadImage(this.userId, this.uploadedFile, "medic-images")
  //       .pipe(switchMap((downloadURL) => this.medicService.setMedicImageUrl(this.userId, downloadURL)))
  //       .subscribe();
  //   }
  // }

  openSnackBar(message: string) {
    this._snackBar.open(message, undefined, {
      duration: 10000,
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        this.imageUploaded = true;
        this.uploadedFile = file;
        console.log(this.imageUrl, this.imageUploaded, this.uploadedFile);
      };
    }
  }

  removeImage(): void {
    this.imageUrl = "";
    this.imageUploaded = false;
  }

  onAutofillClick(): void {
    this.appointmentForm.get("firstName")?.setValue(this.userData?.firstName);
    this.appointmentForm.get("lastName")?.setValue(this.userData?.lastName);
    this.appointmentForm.get("email")?.setValue(this.userData?.email);

    const sexValue = this.userData?.sex![0].toUpperCase().concat(this.userData?.sex!.slice(1));
    this.appointmentForm.get("sex")?.setValue(sexValue);

    const age = this.calculateAge(this.userData?.dateOfBirth!);
    this.appointmentForm.get("age")?.setValue(age);
  }

  private calculateAge(birthDate: Date): number {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const birthYear = birthDate.getFullYear();

    let age: number = currentYear - birthYear;

    // Check if the birthday has occurred this year
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}
