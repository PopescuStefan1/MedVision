import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription, combineLatest, forkJoin, tap } from "rxjs";
import { Medic } from "src/app/models/medic";
import { UserProfile } from "src/app/models/user-profile";
import { MedicService } from "src/app/services/medic.service";
import { UserService } from "src/app/services/user.service";

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

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private medicService: MedicService
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
      console.log("User data:", userData);
      console.log("Medic data:", medicData);
      this.createMedicPageForm(userData, medicData);

      this.medicPageForm.valueChanges.subscribe((newFormValue) => {
        this.isFormChanged = !this.isEqual(newFormValue, this.initialFormValue);
      });

      this.isLoaded = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private createMedicPageForm(userData: UserProfile, medicData: Medic): void {
    this.medicPageForm = this.formBuilder.group({
      lastName: [{ value: userData.lastName, disabled: true }],
      firstName: [{ value: userData.firstName, disabled: true }],
      specialty: [medicData.specialty || "", [Validators.required]],
      title: [medicData.title || "", [Validators.required]],
      shortTitle: [medicData.shortTitle || "", [Validators.required]],
      email: [medicData.email || "", [Validators.required, Validators.email]],
      city: [medicData.city || "", [Validators.required]],
      telephone: [medicData.phoneNumber || "", [Validators.required, Validators.pattern("^[23467](\\d){8}$")]],
    });

    this.initialFormValue = this.medicPageForm.value;
  }

  private isEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  onSubmit(): void {}
}
