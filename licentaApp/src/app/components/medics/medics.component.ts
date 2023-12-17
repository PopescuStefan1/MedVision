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

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getMedics().subscribe({
      next: (medics) => {
        this.medics = medics;
      },
      error: (error) => {
        console.error("Error fetching medics:", error);
      },
    });
  }
}
