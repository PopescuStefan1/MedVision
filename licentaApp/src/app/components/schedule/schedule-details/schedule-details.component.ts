import { DatePipe } from "@angular/common";
import { Component, ElementRef, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { Appointment } from "src/app/models/appointment";
import { LesionClassificationService } from "src/app/services/lesion-classification.service";

interface DialogData {
  appointment: Appointment;
  appointmentDuration: number;
}

@Component({
  selector: "app-schedule-details",
  templateUrl: "./schedule-details.component.html",
  styleUrls: ["./schedule-details.component.css"],
})
export class ScheduleDetailsComponent implements OnInit, OnDestroy {
  mockAnalysisClicked: boolean = false;
  predictionStatusSubscription: Subscription = new Subscription();
  predictionMade: boolean = false;
  modelLoaded: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private datePipe: DatePipe,
    private lesionClassificationService: LesionClassificationService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.predictionStatusSubscription = this.lesionClassificationService.predictionStatus$.subscribe(
      (predictionStatus) => {
        this.predictionMade = predictionStatus;
      }
    );
    this.lesionClassificationService.loadModel().then(() => {
      this.modelLoaded = true;
    });
  }

  ngOnDestroy(): void {
    this.predictionStatusSubscription.unsubscribe();
  }

  getAppointmentTimesAsString(date: Date) {
    const endTime = new Date(date);
    endTime.setMinutes(endTime.getMinutes() + this.data.appointmentDuration);

    const startTimeString = this.datePipe.transform(date, "HH:mm");
    const endTimeString = this.datePipe.transform(endTime, "HH:mm");

    return `${startTimeString} - ${endTimeString}`;
  }

  getTopResults(): {
    name: string;
    shortName: string;
    value: number;
    description: string;
    needsConsult: boolean;
  }[] {
    const sortedResults = [...this.lesionClassificationService.realResults].sort((a, b) => b.value - a.value);

    return sortedResults.slice(0, 3);
  }

  onGetAnalysisClick(): void {
    if (this.data.appointment.imgUrl) {
      this.lesionClassificationService.predictFromImageUrl(this.data.appointment.imgUrl);
    }
  }
}
