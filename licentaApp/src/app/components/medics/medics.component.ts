import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription, combineLatest } from "rxjs";
import { Medic } from "src/app/models/medic";
import { UserProfile } from "src/app/models/user-profile";
import { User } from "src/app/models/user.model";
import { AuthService } from "src/app/services/auth.service";
import { MedicService } from "src/app/services/medic.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-medics",
  templateUrl: "./medics.component.html",
  styleUrls: ["./medics.component.css"],
})
export class MedicsComponent implements OnInit {
  medics: Medic[] = [];
  isFetching: boolean = false;
  defaultPhotoUrl: string =
    "https://images.unsplash.com/photo-1607368386669-d940ce438fba?q=80&w=1843&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  error = null;
  isAuthenticated: boolean = false;
  userId: string | null = null;
  userData?: UserProfile;
  private userSubs: Subscription[] = [];

  constructor(
    private medicService: MedicService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isFetching = true;

    this.authService.user;

    combineLatest([this.medicService.getVisibleMedics(), this.authService.user]).subscribe({
      next: ([medics, user]) => {
        this.medics = medics;
        this.getUserData(user);
      },
      error: (error) => {
        this.error = error.message;
        console.error(error);
      },
    });
  }

  private getUserData(user: User | null): void {
    this.isAuthenticated = !!user;
    this.userId = user ? user.id : null;
    if (this.userId) {
      this.userService.getUserData(this.userId).subscribe((userData) => {
        this.userData = userData;
        this.isFetching = false;
      });
    } else {
      this.isFetching = false;
    }
  }

  onScheduleAppointmentClick(selectedMedic: Medic) {
    if (this.isAuthenticated) {
      this.router.navigate(["/appointments"], {
        queryParams: { city: selectedMedic.city, specialty: selectedMedic.specialty, medicId: selectedMedic.id },
      });
    } else {
      this.router.navigate(["/authenticate"]);
    }
  }

  onMedicPageButtonClick(): void {
    this.router.navigate(["profile", this.userId]);
  }

  onMailClick(email: string): void {
    window.open(`mailto:${email}`);
  }

  onPhoneClick(phoneNumber: string): void {
    const prefix: string = "+40";
    window.open(`tel:${prefix}${phoneNumber}`);
  }
}
