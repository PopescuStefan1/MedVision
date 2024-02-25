import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Medic } from "src/app/models/medic";
import { MedicService } from "src/app/services/medic.service";

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

  constructor(private medicService: MedicService, private router: Router) {}

  ngOnInit(): void {
    this.fetchMedics();
  }

  fetchMedics() {
    this.isFetching = true;
    this.medicService.getAllMedics().subscribe({
      next: (medics) => {
        this.medics = medics;
        this.isFetching = false;
      },
      error: (error) => {
        this.error = error.message;
        console.log(error);
      },
    });
  }

  onScheduleAppointmentClick(selectedMedic: Medic) {
    console.log(selectedMedic);
    this.router.navigate(["/appointments"], {
      queryParams: { city: selectedMedic.city, specialty: selectedMedic.specialty, medicId: selectedMedic.id },
    });
  }
}
