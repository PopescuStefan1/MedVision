import { Component, OnInit } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.css"],
})
export class ScheduleComponent implements OnInit {
  selectedDate: Date = new Date();
  selectedStartOfWeek: Date = new Date();
  selectedEndOfWeek: Date = new Date();
  week: Date[] = [];
  constructor() {}

  ngOnInit(): void {
    this.selectedStartOfWeek = this.getStartOfWeek(new Date());
    this.selectedEndOfWeek = this.getEndOfWeek(new Date());
  }

  private getStartOfWeek(date: Date): Date {
    const day: number = date.getDay();
    const resultDate = new Date(date);
    resultDate.setDate(resultDate.getDate() - day + 1);
    // Set time to 0 to prevent errors
    resultDate.setHours(0, 0, 0, 0);
    return resultDate;
  }

  private getEndOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() + (5 - day);

    return new Date(date.setDate(diff));
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate: Date | null = event.value;
    if (selectedDate) {
      this.selectedDate = selectedDate;
      this.selectedStartOfWeek = this.getStartOfWeek(selectedDate);
      this.selectedEndOfWeek = this.getEndOfWeek(selectedDate);
    }
  }

  weekendFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  onPrevClick(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() - 7);
    this.selectedStartOfWeek = this.getStartOfWeek(this.selectedDate);
    this.selectedEndOfWeek = this.getEndOfWeek(this.selectedDate);
  }

  onNextClick(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() + 7);
    this.selectedStartOfWeek = this.getStartOfWeek(this.selectedDate);
    this.selectedEndOfWeek = this.getEndOfWeek(this.selectedDate);
  }
}
