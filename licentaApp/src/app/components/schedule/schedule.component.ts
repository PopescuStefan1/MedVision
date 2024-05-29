import { Component, OnInit } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { Router } from "@angular/router";
import { EMPTY, switchMap } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { MedicService } from "src/app/services/medic.service";

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
  medicPageExists: boolean = false;
  isLoadingMedicInfo: boolean = false;
  userId?: string;

  constructor(private authService: AuthService, private medicService: MedicService, private router: Router) {}

  ngOnInit(): void {
    this.isLoadingMedicInfo = true;

    this.authService.user
      .pipe(
        switchMap((user) => {
          if (user) {
            this.userId = user.id;
            return this.medicService.getMedicByUserId(user.id);
          } else {
            this.medicPageExists = false;
            this.isLoadingMedicInfo = false;
            return EMPTY;
          }
        })
      )
      .subscribe((medic) => {
        if (medic) {
          this.selectedDate.setHours(0, 0, 0, 0);
          this.handleWeekStartAndEnd();
          this.medicPageExists = true;
        } else {
          this.medicPageExists = false;
        }
        this.isLoadingMedicInfo = false;
      });
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
    const sunday = new Date(this.selectedStartOfWeek);
    sunday.setDate(this.selectedStartOfWeek.getDate() + 7);

    return today.getTime() > this.selectedStartOfWeek.getTime() && today.getTime() < sunday.getTime();
  }

  onProfileButtonClick(): void {
    this.router.navigate(["/profile", this.userId]);
  }
}
