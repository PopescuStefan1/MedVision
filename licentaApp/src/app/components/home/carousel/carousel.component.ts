import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription, interval } from "rxjs";

@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.css"],
})
export class CarouselComponent implements OnInit, OnDestroy {
  carouselSections: { url: string; text: string }[] = [
    {
      url: "https://images.unsplash.com/photo-1581056771392-8a90ddb76831?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      text: "Improving life quality and bringing smiles to you and your loved ones",
    },
    {
      url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      text: "Integrating technology into medicine for excellence in healthcare",
    },
    {
      url: "https://images.unsplash.com/photo-1598300188480-626f2f79ab8d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      text: "Fast, reliable medical screening for all of your needs",
    },
    {
      url: "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      text: "Cutting edge research facilites to provide world-class care",
    },
  ];
  activeImageIndex: number = 0;
  private intervalSubscription: Subscription = new Subscription();

  constructor() {}

  ngOnInit(): void {
    this.startInterval();
  }

  ngOnDestroy(): void {
    this.stopInterval();
  }

  private startInterval(): void {
    const imgChangeTime = 5000;

    const source = interval(imgChangeTime);

    this.intervalSubscription = source.subscribe(() => {
      this.switchToNextImg();
    });
  }

  private stopInterval(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  resetInterval(): void {
    this.stopInterval();
    this.startInterval();
  }

  switchToPrevImg(): void {
    if (this.activeImageIndex === 0) {
      this.activeImageIndex = this.carouselSections.length - 1;
      return;
    }
    this.activeImageIndex--;

    this.resetInterval();
  }

  switchToNextImg(): void {
    if (this.activeImageIndex === this.carouselSections.length - 1) {
      this.activeImageIndex = 0;
      return;
    }
    this.activeImageIndex++;

    this.resetInterval();
  }
}
