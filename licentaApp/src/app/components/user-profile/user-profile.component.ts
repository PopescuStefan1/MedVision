import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { MyErrorStateMatcher } from "../auth/auth.component";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  userId: string;
  profileForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  minDate: Date;
  maxDate: Date;
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private userService: UserService) {
    this.userId = this.route.snapshot.paramMap.get("userId") || "";
    this.minDate = new Date(1900, 0, 1);
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getUserData(this.userId).subscribe((userData) => {
      this.createUserForm(userData);
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
  }

  onSubmit() {
    const updatedUserData = this.profileForm.value;

    this.userService.updateUserData(this.userId, updatedUserData).subscribe(
      () => {
        console.log("Profile updated successfully!");
      },
      (error) => {
        console.error("Error updating profile:", error);
      }
    );
  }
}
