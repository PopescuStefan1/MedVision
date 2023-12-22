import { Component, OnInit } from "@angular/core";
import { Medic } from "src/app/models/medic";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "app-medics",
  templateUrl: "./medics.component.html",
  styleUrls: ["./medics.component.css"],
})
export class MedicsComponent implements OnInit {
  medics: Medic[] = [];
  loaded: boolean = false;
  defaultPhotoUrl: string =
    "https://images.unsplash.com/photo-1607368386669-d940ce438fba?q=80&w=1843&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // this.dataService.initializeMedics();
    this.dataService.getAllMedics().subscribe({
      next: (medics) => {
        this.medics = medics;
        this.loaded = true;
      },
      error: (error) => {
        console.error("Error fetching medics: ", error);
      },
    });
    this.dataService.getAllMedics().subscribe((responseData) => {
      this.medics = responseData;
    });
  }
}
