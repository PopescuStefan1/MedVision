import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { EMPTY, Observable, Subscription, catchError, switchMap } from "rxjs";
import { Appointment } from "src/app/models/appointment";
import { Medic } from "src/app/models/medic";
import { UserProfile } from "src/app/models/user-profile";
import { User } from "src/app/models/user.model";
import { AppointmentService } from "src/app/services/appointment.service";
import { AuthService } from "src/app/services/auth.service";
import { MedicService } from "src/app/services/medic.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-schedule-table",
  templateUrl: "./schedule-table.component.html",
  styleUrls: ["./schedule-table.component.css"],
})
export class ScheduleTableComponent implements OnChanges, OnInit, OnDestroy {
  @Input() startDate?: Date;
  @Input() endDate?: Date;
  week: Date[] = [];
  displayedWeekColumns: string[] = [];
  hoursArray: number[] = [];
  minutesArray: number[] = [];
  data: any = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private medicService: MedicService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["startDate"] || changes["endDate"]) {
      this.initWeek();

      if (this.startDate && this.endDate) {
        this.subscription.add(
          this.getAppointmentsForWeek(this.startDate, this.endDate).subscribe((apps) => {
            console.log(apps);
          })
        );
      }
    }
  }

  ngOnInit(): void {
    this.initWeek();
    this.setUpHoursAndMinutesArray();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initWeek(): void {
    if (this.startDate) {
      this.createWeek(this.startDate);
    }
  }

  private createWeek(monday: Date): void {
    this.week = [];
    this.displayedWeekColumns = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(monday.getDate() + i);

      this.week.push(date);

      const dateString = `${date.getDay()}\n${date.getDate()}`;
      this.displayedWeekColumns.push(dateString);
    }
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

  private getAppointmentsForWeek(startDate: Date, endDate: Date): Observable<Appointment[]> {
    // Ia schedule pentru un medic (userul curent)
    return this.authService.user.pipe(
      switchMap((user: User | null) => {
        console.log("User:", user?.id);
        if (user?.id) {
          return this.medicService.getMedicByUserId(user?.id).pipe(
            catchError((error) => {
              // Error handling
              console.error("Error fetching medic:", error);
              return EMPTY;
            })
          );
        }
        return EMPTY;
      }),
      switchMap((medic: Medic) => {
        console.log("Medic:", medic);
        if (medic.id && this.startDate && this.endDate) {
          return this.appointmentService.getMedicWeekAppointments(medic.id, startDate, endDate).pipe(
            catchError((error) => {
              // Error handling
              console.error("Error fetching medic week appointments:", error);
              return EMPTY;
            })
          );
        }
        return EMPTY;
      })
    );
  }
}
