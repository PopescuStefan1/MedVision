import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Appointment } from "src/app/models/appointment";

interface DialogData {
  appointment: Appointment;
  appointmentDuration: number;
}

@Component({
  selector: "app-schedule-details",
  templateUrl: "./schedule-details.component.html",
  styleUrls: ["./schedule-details.component.css"],
})
export class ScheduleDetailsComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private datePipe: DatePipe) {}

  ngOnInit(): void {}

  getAppointmentTimesAsString(date: Date) {
    const endTime = new Date(date);
    endTime.setMinutes(endTime.getMinutes() + this.data.appointmentDuration);

    const startTimeString = this.datePipe.transform(date, "HH:mm");
    const endTimeString = this.datePipe.transform(endTime, "HH:mm");

    return `${startTimeString} - ${endTimeString}`;
  }
}
