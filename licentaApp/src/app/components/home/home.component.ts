import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  onContactButtonClick(): void {
    this.router.navigate(["contact"]);
  }

  onAboutButtonClick(): void {
    this.router.navigate(["about"]);
  }

  onMedicsButtonClick(): void {
    this.router.navigate(["medics"]);
  }
}
