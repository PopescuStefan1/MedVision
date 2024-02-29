import { DatePipe } from "@angular/common";
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { EMPTY, Observable, Subscription, catchError, switchMap } from "rxjs";
import { Appointment } from "src/app/models/appointment";
import { Medic } from "src/app/models/medic";
import { User } from "src/app/models/user.model";
import { AppointmentService } from "src/app/services/appointment.service";
import { AuthService } from "src/app/services/auth.service";
import { MedicService } from "src/app/services/medic.service";

export interface AppointmentTableData {
  hour: number;
  mon: Appointment[];
  tue: Appointment[];
  wed: Appointment[];
  thu: Appointment[];
  fri: Appointment[];
}

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
  appointmentTableData: AppointmentTableData[] = [];
  dataLoaded: boolean = false;
  startHour: number = 8;
  endHour: number = 17;
  appointmentTime: number = 20;
  private subscription: Subscription = new Subscription();

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private medicService: MedicService,
    private datePipe: DatePipe
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["startDate"] || changes["endDate"]) {
      this.dataLoaded = false;
      this.initWeek();

      if (this.startDate && this.endDate) {
        this.subscription.add(
          this.getAppointmentsForWeek(this.startDate, this.endDate).subscribe((apps) => {
            this.createTableData(apps);
            console.log(this.appointmentTableData);
            this.dataLoaded = true;
          })
        );
      }
    }
  }

  ngOnInit(): void {
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
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      this.week.push(date);
    }

    this.displayedWeekColumns = this.formatDates(this.week);
  }

  private formatDates(dates: Date[]): string[] {
    return dates.map((date) => this.datePipe.transform(date, "EEE, d") || "");
  }

  private setUpHoursAndMinutesArray(): void {
    this.hoursArray = [];
    for (let index = this.startHour; index <= this.endHour; index++) {
      this.hoursArray.push(index);
    }

    this.minutesArray = [];
    for (let index = 0; index < 60; index += this.appointmentTime) {
      this.minutesArray.push(index);
    }
  }

  // Ia schedule pentru un medic (userul curent) pentru saptamana curenta
  private getAppointmentsForWeek(startDate: Date, endDate: Date): Observable<Appointment[]> {
    return this.authService.user.pipe(
      switchMap((user: User | null) => {
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

  private createTableData(appointments: Appointment[]): void {
    this.resetTableDate();

    for (let appointment of appointments) {
      const appointmentHour = appointment.datetime.getHours();
      for (let hour of this.hoursArray) {
        if (appointmentHour === hour) {
          this.appointmentTableData[hour - 8].mon.push(appointment);
          break;
        }
      }
    }
  }

  private resetTableDate(): void {
    // Reset table data
    this.appointmentTableData = [];
    for (let hour of this.hoursArray) {
      const row: AppointmentTableData = { hour: hour, mon: [], tue: [], wed: [], thu: [], fri: [] };
      this.appointmentTableData.push(row);
    }
  }

  getShortDay(dateString: string): string {
    return dateString.slice(0, 3).toLowerCase();
  }
}
