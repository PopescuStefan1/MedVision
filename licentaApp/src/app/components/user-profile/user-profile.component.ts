import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { MyErrorStateMatcher } from "../auth/auth.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  userId: string;
  profileForm!: FormGroup;
  initialFormValue: any;
  matcher = new MyErrorStateMatcher();
  minDate: Date;
  maxDate: Date;
  isLoading: boolean = false;
  isFormChanged: boolean = false;
  isMedicUser: boolean = false;
  isProfileFilled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.userId = this.route.snapshot.paramMap.get("userId") || "";
    this.minDate = new Date(1900, 0, 1);
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getUserData(this.userId).subscribe((userData) => {
      this.createUserForm(userData);
      this.subscribeToFormChanges();

      this.isMedicUser = userData.role === "medic";

      if (userData.firstName) {
        // If the profile has been filled by the user enable the medic button
        this.isProfileFilled = true;
      }
      this.isLoading = false;
    });
  }

  createUserForm(userData: any) {
    this.profileForm = this.formBuilder.group({
      email: [{ value: userData?.email, disabled: true } || ""],
      firstName: [userData?.firstName || "", [Validators.required]],
      lastName: [userData?.lastName || "", [Validators.required]],
      sex: [userData?.sex || "", [Validators.required]],
      dateOfBirth: [userData?.dateOfBirth || "", [Validators.required]],
      nationality: [userData?.nationality || "", [Validators.required]],
      address: this.formBuilder.group({
        street: [userData?.address?.street || "", [Validators.required]],
        country: [userData?.address?.country || "", [Validators.required]],
        state: [userData?.address?.state || "", [Validators.required]],
        city: [userData?.address?.city || "", [Validators.required]],
        postalCode: [userData?.address?.postalCode || "", [Validators.required, Validators.minLength(6)]],
      }),
    });

    this.initialFormValue = this.profileForm.value;
  }

  subscribeToFormChanges() {
    this.profileForm.valueChanges.subscribe((newFormValue) => {
      this.isFormChanged = !this.isEqual(newFormValue, this.initialFormValue);
    });
  }

  isEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, undefined, {
      duration: 5000,
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const updatedUserData = this.profileForm.value;

      this.userService.updateUserData(this.userId, updatedUserData).subscribe({
        next: () => {
          this.openSnackBar("Successfully updated personal information.");
          this.isProfileFilled = true;
        },
        error: (error) => {
          this.openSnackBar(`An error occured ${error}`);
        },
      });
    }
  }

  onMedicPageButtonClick(): void {
    this.router.navigate(["medic-page", this.userId]);
  }
}
