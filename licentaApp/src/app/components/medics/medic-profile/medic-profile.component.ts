import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription, combineLatest, switchMap, tap } from "rxjs";
import { Medic } from "src/app/models/medic";
import { UserProfile } from "src/app/models/user-profile";
import { MedicService } from "src/app/services/medic.service";
import { UserService } from "src/app/services/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";

import { cityNames } from "src/app/city_data/cityData";

interface MedicDetail {
  firstName?: string;
  lastName?: string;
  specialty?: string;
  title?: string;
  shortTitle?: string;
}

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
  uploadedFile?: File;
  imageUrl: string = "";
  imageChanged: boolean = false;
  medicDetail: MedicDetail = {};

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

      // Set medic details
      this.medicDetail = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        specialty: medicData ? medicData.specialty : "",
        title: medicData ? medicData.title : "",
        shortTitle: medicData ? medicData.shortTitle : "",
      };

      if (medicData) {
        this.isCurrentlyVisible = medicData.isVisible;
        if (!medicData.photoUrl) {
          this.medicService.getDefaulImgUrl().subscribe((imgUrl) => {
            this.imageUrl = imgUrl;
            this.isLoaded = true;
          });
        } else {
          this.imageUrl = medicData.photoUrl;
          this.isLoaded = true;
        }
      }

      this.medicPageForm.valueChanges.subscribe((newFormValue) => {
        this.isFormChanged = !this.isEqual(newFormValue, this.initialFormValue);
      });
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

  onMedicDetailsChange(): void {
    this.medicDetail.specialty = this.medicPageForm.get("specialty")?.value;
    this.medicDetail.title = this.medicPageForm.get("title")?.value;
    this.medicDetail.shortTitle = this.medicPageForm.get("shortTitle")?.value;
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
      isVisible: false,
      userId: this.userId,
      photoUrl: this.imageUrl,
    };

    this.handleMedicSave(medic);
  }

  private handleMedicSave(medic: Medic): void {
    if (this.firstCreation) {
      this.medicService
        .addMedic(medic)
        .pipe(
          tap(() => {
            this.openEditSnackbar(
              "Successfully set up your medic page. If you want your page to appear in the medics list, make sure to set your page to visible!"
            );
            this.handleImageUpload();
          })
        )
        .subscribe();
    } else {
      this.medicService
        .editMedicByUserId(this.userId, medic)
        .pipe(
          tap(() => {
            this.openEditSnackbar(
              "Successfully edited your medic page. If you want your page to appear in the medics list, make sure to set your page to visible!"
            );
            this.handleImageUpload();
          })
        )
        .subscribe();
    }
  }

  private handleImageUpload(): void {
    console.log(this.imageChanged, this.uploadedFile);
    if (this.imageChanged && this.uploadedFile) {
      this.medicService
        .uploadImage(this.userId, this.uploadedFile, "medic-images")
        .pipe(
          switchMap((downloadURL) => {
            console.log("Setting medic image");
            return this.medicService.setMedicImageUrl(this.userId, downloadURL);
          })
        )
        .subscribe(() => {
          // Reset flags
          this.firstCreation = false;
          this.isFormChanged = false;
          this.imageChanged = false;
        });
    } else {
      // Reset flags
      this.firstCreation = false;
      this.isFormChanged = false;
      this.imageChanged = false;
    }
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
      duration: 10000,
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
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        this.imageChanged = true;
        this.uploadedFile = file;
      };
    }
  }
}
