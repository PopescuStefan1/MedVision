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
    this.selectedDate.setHours(0, 0, 0, 0);
    this.handleWeekStartAndEnd();
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
    const resultDate = new Date(date);
    resultDate.setDate(date.getDate() + (5 - day));
    // Set time to end of day
    resultDate.setHours(23, 59, 59, 999);

    return resultDate;
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate: Date | null = event.value;
    if (selectedDate) {
      this.selectedDate = selectedDate;
      this.handleWeekStartAndEnd();
    }
  }

  weekendFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  onPrevClick(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() - 7);
    this.handleWeekStartAndEnd();
  }

  onNextClick(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() + 7);
    this.handleWeekStartAndEnd();
  }

  onTodayClick(): void {
    this.selectedDate = new Date();
    this.selectedDate.setHours(0, 0, 0, 0);

    this.handleWeekStartAndEnd();
  }

  private handleWeekStartAndEnd(): void {
    this.selectedStartOfWeek = this.getStartOfWeek(this.selectedDate);
    this.selectedEndOfWeek = this.getEndOfWeek(this.selectedDate);
  }

  isCurrentWeekSelected(): boolean {
    const today = new Date();
    const sunday = new Date();
    sunday.setDate(this.selectedStartOfWeek.getDate() + 7);

    return today.getTime() > this.selectedStartOfWeek.getTime() && today.getTime() < sunday.getTime();
  }
}
