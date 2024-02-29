import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: "app-schedule-table",
  templateUrl: "./schedule-table.component.html",
  styleUrls: ["./schedule-table.component.css"],
})
export class ScheduleTableComponent implements OnChanges, OnInit {
  @Input() startDate?: Date;
  @Input() endDate?: Date;
  week: Date[] = [];
  displayedWeekColumns: string[] = [];
  hoursArray: number[] = [];
  minutesArray: number[] = [];
  data: any = [{}];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["startDate"]) {
      this.initWeek();
    }
  }

  ngOnInit(): void {
    this.initWeek();
    this.setUpHoursAndMinutesArray();
  }

  private initWeek(): void {
    if (this.startDate) {
      this.createWeek(this.startDate);
    }
  }

  private createWeek(monday: Date): void {
    this.week = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(monday.getDate() + i);

      this.week.push(date);

      const dateString = `${date.getDay()}\n${date.getDate()}`;
      this.displayedWeekColumns.push(dateString);
    }

    console.log(this.displayedWeekColumns);
  }

  private setUpHoursAndMinutesArray(): void {
    this.hoursArray = [];
    for (let index = 8; index <= 17; index++) {
      this.hoursArray.push(index);
    }

    this.minutesArray = [];
    for (let index = 0; index <= 40; index += 20) {
      this.minutesArray.push(index);
    }
  }
}
