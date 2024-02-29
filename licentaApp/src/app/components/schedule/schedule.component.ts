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
    this.selectedStartOfWeek = this.getMonday(new Date());
    this.selectedEndOfWeek = this.getSunday(new Date());
    this.createWeek(this.selectedStartOfWeek);
  }

  private getMonday(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday
    return new Date(date.setDate(diff));
  }

  private getSunday(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() + (5 - day);

    return new Date(date.setDate(diff));
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate: Date | null = event.value;
    if (selectedDate) {
      this.selectedDate = selectedDate;
      this.selectedStartOfWeek = this.getMonday(selectedDate);
      this.selectedEndOfWeek = this.getSunday(selectedDate);
    }
    this.createWeek(this.selectedStartOfWeek);
  }

  weekendFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  createWeek(monday: Date) {
    this.week = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(monday.getDate() + i);

      this.week.push(date);
    }
  }
}
