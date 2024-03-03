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
  mon: (Appointment | Date)[];
  tue: (Appointment | Date)[];
  wed: (Appointment | Date)[];
  thu: (Appointment | Date)[];
  fri: (Appointment | Date)[];
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
  endHour: number = 16;
  appointmentDuration: number = 20;
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
    for (let index = this.startHour; index < this.endHour; index++) {
      this.hoursArray.push(index);
    }

    this.minutesArray = [];
    for (let index = 0; index < 60; index += this.appointmentDuration) {
      this.minutesArray.push(index);
    }
  }

  // Get schedule for a medic (current user) for current week
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
    for (let day of this.week) {
      const dayString = day.toString().slice(0, 3).toLowerCase();

      for (let hour of this.hoursArray) {
        const tableDataEntry = this.appointmentTableData[hour - 8][dayString as keyof AppointmentTableData];
        const appointmentsPerHour: number = 60 / this.appointmentDuration;

        // Break if all appointments in an hour have been filled
        if (Array.isArray(tableDataEntry) && appointmentsPerHour === tableDataEntry.length) {
          break;
        }

        for (let minutes: number = 0; minutes < 60; minutes += this.appointmentDuration) {
          let appointmentFound: boolean = false;

          for (let appointment of appointments) {
            if (Array.isArray(tableDataEntry)) {
              if (this.doesAppointmentMatch(appointment, day, hour, minutes)) {
                // Add the appointment to the tabledata if it exists at a certain day, hour and minute
                tableDataEntry.push(appointment);

                // Remove added appointment from appointments array
                appointmentFound = true;
                break;
              }
            }
          }

          if (Array.isArray(tableDataEntry) && !appointmentFound) {
            // Else pad with a Date at that day, hour and minute
            const date = new Date();
            date.setHours(hour);
            date.setMinutes(minutes);
            tableDataEntry.push(date);
          }
        }
      }
    }
  }

  private doesAppointmentMatch(
    appointment: Appointment,
    targetDay: Date,
    targetHour: number,
    targetMinute: number
  ): boolean {
    // Check if the day, hour, and minute match
    return (
      appointment.datetime.getDay() === targetDay.getDay() &&
      appointment.datetime.getHours() === targetHour &&
      appointment.datetime.getMinutes() === targetMinute
    );
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

  isAppointment(appointment: Appointment | Date): boolean {
    return appointment instanceof Date ? false : true;
  }

  getAppointmentTimeDisplay(appointment: Appointment): string {
    const endTime = new Date(appointment.datetime);
    endTime.setMinutes(endTime.getMinutes() + this.appointmentDuration);

    const startTimeString = this.datePipe.transform(appointment.datetime, "HH:mm");
    const endTimeString = this.datePipe.transform(endTime, "HH:mm");

    return `${startTimeString} - ${endTimeString}:`;
  }

  getDateDisplay(appointment: Date): string {
    const endTime = new Date(appointment);
    endTime.setMinutes(endTime.getMinutes() + this.appointmentDuration);

    const startTimeString = this.datePipe.transform(appointment, "HH:mm");
    const endTimeString = this.datePipe.transform(endTime, "HH:mm");

    return `${startTimeString} - ${endTimeString}:`;
  }
}
