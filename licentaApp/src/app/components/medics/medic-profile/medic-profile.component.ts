import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription, combineLatest } from "rxjs";
import { Medic } from "src/app/models/medic";
import { UserProfile } from "src/app/models/user-profile";
import { MedicService } from "src/app/services/medic.service";
import { UserService } from "src/app/services/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";

import { cityNames } from "src/app/city_data/cityData";

@Component({
  selector: "app-medic-profile",
  templateUrl: "./medic-profile.component.html",
  styleUrls: ["./medic-profile.component.css"],
})
export class MedicProfileComponent implements OnInit, OnDestroy {
  userId: string;
  medicPageForm!: FormGroup;
  initialFormValue: any;
  isLoaded: boolean = false;
  subscription: Subscription = new Subscription();
  isFormChanged: boolean = false;
  cityNames: string[] = [];
  firstCreation: boolean = false;
  isCurrentlyVisible: boolean = false;
  selectedFile?: File;
  backgroundImageUrl: string = "";

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private medicService: MedicService,
    private _snackBar: MatSnackBar
  ) {
    this.userId = this.route.snapshot.paramMap.get("userId") || "";
  }

  ngOnInit(): void {
    this.isLoaded = false;
    this.cityNames = cityNames.sort((a, b) => a.localeCompare(b, "ro"));

    this.subscription = combineLatest([
      this.userService.getUserData(this.userId),
      this.medicService.getMedicByUserId(this.userId),
    ]).subscribe(([userData, medicData]) => {
      // Check if medic data is available
      this.firstCreation = !!!medicData;
      this.createMedicPageForm(userData, medicData);

      if (medicData) {
        this.isCurrentlyVisible = medicData.isVisible;
      }

      this.medicPageForm.valueChanges.subscribe((newFormValue) => {
        this.isFormChanged = !this.isEqual(newFormValue, this.initialFormValue);
      });

      this.isLoaded = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private createMedicPageForm(userData: UserProfile, medicData: Medic | null): void {
    this.medicPageForm = this.formBuilder.group({
      lastName: [{ value: userData.lastName, disabled: true }],
      firstName: [{ value: userData.firstName, disabled: true }],
      specialty: [medicData?.specialty || "", [Validators.required]],
      title: [medicData?.title || "", [Validators.required]],
      shortTitle: [medicData?.shortTitle || "", [Validators.required]],
      email: [medicData?.email || "", [Validators.required, Validators.email]],
      city: [medicData?.city || "", [Validators.required]],
      telephone: [medicData?.phoneNumber || "", [Validators.required, Validators.pattern("^[23467](\\d){8}$")]],
    });

    this.initialFormValue = this.medicPageForm.value;
  }

  private isEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  onSubmit(): void {
    const medic: Medic = {
      firstName: this.medicPageForm.get("firstName")?.value,
      lastName: this.medicPageForm.get("lastName")?.value,
      email: this.medicPageForm.get("email")?.value,
      specialty: this.medicPageForm.get("specialty")?.value,
      title: this.medicPageForm.get("title")?.value,
      shortTitle: this.medicPageForm.get("shortTitle")?.value,
      city: this.medicPageForm.get("city")?.value,
      phoneNumber: this.medicPageForm.get("telephone")?.value,
      patientIds: [],
      isVisible: false,
      userId: this.userId,
    };

    if (this.firstCreation) {
      this.medicService.addMedic(medic).subscribe(() => {
        this.openEditSnackbar("Successfully set up your medic page");
      });
    } else {
      this.medicService.editMedicByUserId(this.userId, medic).subscribe(() => {
        this.openEditSnackbar("Successfully edited your medic page");
      });
    }

    this.firstCreation = false;
    this.isFormChanged = false;
  }

  toggleMedicVisibility(): void {
    this.medicService.updateMedicVisibility(this.userId, !this.isCurrentlyVisible).subscribe(() => {
      this.isCurrentlyVisible
        ? this.openVisibilitySnackbar("Your page is now visible")
        : this.openVisibilitySnackbar("Your page is now hidden");
    });
  }

  private openEditSnackbar(message: string): void {
    this._snackBar.open(message, undefined, {
      duration: 5000,
    });
  }

  private openVisibilitySnackbar(message: string): void {
    const snackBarRef = this._snackBar.open(message, "Undo", {
      duration: 5000,
      verticalPosition: "top",
    });

    snackBarRef.onAction().subscribe(() => {
      this.medicService.updateMedicVisibility(this.userId, !this.isCurrentlyVisible).subscribe();
    });
  }

  onFileSelected(event: any): void {
    // const reader = new FileReader();
    // if (event.target.files && event.target.files[0]) {
    //   // Read the selected file as data URL
    //   reader.readAsDataURL(event.target.files[0]);
    //   reader.onload = (e: any) => {
    //     this.selectedFile = e.target.result;
    //     console.log(this.selectedFile);
    //   };
    // }
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.backgroundImageUrl = reader.result as string;
      };
    }
  }
}
