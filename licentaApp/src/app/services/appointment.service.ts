import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { Timestamp } from "@angular/fire/firestore";
import { Observable, Subject, catchError, from, map, switchMap, take, tap, throwError } from "rxjs";
import { Medic } from "../models/medic";
import { Appointment } from "../models/appointment";
import { FirebaseAppointment } from "../models/firebase-appointment";
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from "@angular/fire/compat/storage";

@Injectable({
  providedIn: "root",
})
export class AppointmentService {
  private addAppointmentSubject = new Subject<void>();
  public addAppointment$ = this.addAppointmentSubject.asObservable();

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  getDistinctCities(): Observable<string[]> {
    return this.firestore
      .collection("medics")
      .get()
      .pipe(
        map((querySnapshot) => {
          const cities: string[] = [];

          querySnapshot.forEach((doc) => {
            // Explicitly cast the type of doc.data()
            const city: string = (doc.data() as Medic).city;

            if (!cities.includes(city)) {
              cities.push(city);
            }
          });

          return cities;
        })
      );
  }

  getSpecialtiesForCity(selectedCity: string) {
    return this.firestore
      .collection("medics", (ref) => ref.where("city", "==", selectedCity))
      .get()
      .pipe(
        map((querySnapshot) => {
          const specialties: string[] = [];

          querySnapshot.forEach((doc) => {
            // Explicitly cast the type of doc.data()
            const specialty: string = (doc.data() as Medic).specialty;

            if (!specialties.includes(specialty)) {
              specialties.push(specialty);
            }
          });

          return specialties;
        })
      );
  }

  getMedicsForCityAndSpecialty(selectedCity: string, selectedSpecialty: string) {
    return this.firestore
      .collection<Medic>("medics", (ref) =>
        ref.where("city", "==", selectedCity).where("specialty", "==", selectedSpecialty)
      )
      .valueChanges({ idField: "id" });
  }

  getMedicAppointments(selectedMedic: Medic) {
    return this.firestore.collection<Appointment>("appointments", (ref) =>
      ref.where("medicId", "==", selectedMedic.id)
    );
  }

  getMedicAppointmentBookedTimes(selectedMedicId: string, date: Date): Observable<Set<Date>> {
    const startOfDay = Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    const endOfDay = Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));

    return this.firestore
      .collection("appointments", (ref) =>
        ref.where("medicId", "==", selectedMedicId).where("datetime", ">=", startOfDay).where("datetime", "<", endOfDay)
      )
      .get()
      .pipe(
        map((querySnapshot) => {
          const bookedTimes: Set<Date> = new Set();

          querySnapshot.forEach((doc) => {
            // Explicitly cast the type of doc.data()
            const data = doc.data() as { datetime: Timestamp };
            const datetime: Timestamp = data.datetime;

            const appointmentDate: Date = datetime.toDate();
            appointmentDate.setSeconds(0);
            appointmentDate.setMilliseconds(0);

            bookedTimes.add(appointmentDate);
          });

          return bookedTimes;
        })
      );
  }

  getMedicWeekAppointments(selectedMedicId: string, startDate: Date, endDate: Date): Observable<Appointment[]> {
    const startOfFirstDay: Timestamp = Timestamp.fromDate(
      new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
    );
    const endOfLastDay: Timestamp = Timestamp.fromDate(
      new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1)
    );

    return this.firestore
      .collection<FirebaseAppointment>("appointments", (ref) =>
        ref
          .where("medicId", "==", selectedMedicId)
          .where("datetime", ">=", startOfFirstDay)
          .where("datetime", "<", endOfLastDay)
      )
      .get()
      .pipe(
        map((querySnapshot) => {
          const appointments: Appointment[] = [];

          querySnapshot.forEach((doc) => {
            const firebaseAppointmentData: FirebaseAppointment = doc.data();

            // Convert firebase appointment to web app appointment
            const appointment: Appointment = {
              ...firebaseAppointmentData,
              datetime: firebaseAppointmentData.datetime.toDate(),
            };

            appointments.push(appointment);
          });

          return appointments;
        })
      );
  }

  addApointment(appointmentData: Appointment): Observable<any> {
    const firebaseAppointmentData: FirebaseAppointment = {
      ...appointmentData,
      datetime: Timestamp.fromDate(appointmentData.datetime),
    };

    const collectionRef = this.firestore.collection("appointments");
    return from(collectionRef.add(firebaseAppointmentData)).pipe(
      // Emit a signal when the appointment is added
      tap(() => this.addAppointmentSubject.next())
    );
  }

  getAppointmentsByUserId(userId: string) {
    return this.firestore
      .collection<FirebaseAppointment>("appointments", (ref) => ref.where("userId", "==", userId).orderBy("datetime"))
      .get()
      .pipe(
        map((querySnapshot) => {
          const appointments: Appointment[] = [];

          querySnapshot.forEach((doc) => {
            const firebaseAppointmentData = doc.data() as FirebaseAppointment;

            // Convert timestamp to Date and FirebaseAppointment to Appointment
            const appointmentData: Appointment = {
              ...firebaseAppointmentData,
              datetime: firebaseAppointmentData.datetime.toDate(),
            };

            appointments.push(appointmentData);
          });

          return appointments;
        })
      );
  }

  uploadImage(file: File, path: string): Observable<string> {
    const storageRef: AngularFireStorageReference = this.storage.ref(`${path}/${new Date().getTime()}${file.name}`);
    const task: AngularFireUploadTask = storageRef.put(file);

    return from(task).pipe(
      switchMap(() => {
        return storageRef.getDownloadURL().pipe(
          catchError((error) => {
            console.error("Error getting download URL:", error);
            return throwError(() => error);
          })
        );
      }),
      catchError((error) => throwError(() => error))
    );
  }
}
