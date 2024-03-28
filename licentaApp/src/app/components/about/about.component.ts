import { Component, ElementRef, OnInit } from "@angular/core";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  onArrowClick(): void {
    const element = this.elementRef.nativeElement.querySelector("#vision");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
