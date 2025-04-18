import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, forkJoin, from, map, of, switchMap } from 'rxjs';
import { Appointment } from 'src/app/models/appointment';
import { Medic } from 'src/app/models/medic';
import { AppointmentService } from 'src/app/services/appointment.service';
import { MedicService } from 'src/app/services/medic.service';

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view-appointment.component.html',
  styleUrls: ['./view-appointment.component.css'],
})
export class ViewAppointmentComponent implements OnInit {
  @Input() userId: string = '';
  appointments$: Observable<Appointment[]> = new Observable();
  pastAppointments$: Observable<Appointment[]> = new Observable();
  futureAppointments$: Observable<Appointment[]> = new Observable();
  medics: Medic[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private medicService: MedicService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAppointmentsForUser();
    this.getMedicsForAppointments();
  }

  getAppointmentsForUser(): void {
    // this.appointments$ = this.appointmentService.getAppointmentsByUserId(
    //   this.userId
    // );

    this.appointments$ = this.appointmentService.getAppointments();

    this.appointments$ = this.appointments$.pipe(
      map((appointments) =>
        appointments.filter((appointment) => appointment.userId === this.userId)
      )
    );

    this.pastAppointments$ = this.appointments$.pipe(
      map((appointments) =>
        appointments
          .filter((appointment) => appointment.datetime < new Date())
          .sort((a, b) => b.datetime.getTime() - a.datetime.getTime())
      )
    );

    this.futureAppointments$ = this.appointments$.pipe(
      map((appts) => appts.filter((a) => a.datetime >= new Date())),
      switchMap((appts) => {
        const enriched = appts.map((appt) => {
          if (appt.imgUrl?.includes('.svg')) {
            return from(fetch(appt.imgUrl).then((res) => res.text())).pipe(
              map((svg) => ({
                ...appt,
                svgHtmlContent: this.sanitizer.bypassSecurityTrustHtml(
                  svg
                ) as SafeHtml,
              }))
            );
          }
          return of(appt);
        });
        return forkJoin(enriched);
      })
    );
  }

  getMedicsForAppointments(): void {
    this.appointments$
      .pipe(
        switchMap((appointments) => {
          const medicIds: string[] = appointments.map(
            (appointment) => appointment.medicId
          );
          return this.medicService.getMedicsById(medicIds);
        })
      )
      .subscribe((medics) => {
        this.medics = medics;
      });
  }

  getMedicById(medicId: string): Medic | undefined {
    return this.medics.find((medic) => medic.id === medicId);
  }
}
