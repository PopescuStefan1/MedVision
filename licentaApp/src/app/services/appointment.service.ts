import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Timestamp } from "@angular/fire/firestore";
import { Observable, from, map } from "rxjs";
import { Medic } from "../models/medic";
import { Appointment } from "../models/appointment";
import { FirebaseAppointment } from "../models/firebase-appointment";

@Injectable({
  providedIn: "root",
})
export class AppointmentService {
  constructor(private firestore: AngularFirestore) {}

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

  getMedicAppointmentBookedTimes(selectedMedicId: number, date: Date) {
    const startOfDay = Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    const endOfDay = Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));

    return this.firestore
      .collection("appointments", (ref) =>
        ref
          .where("medicId", "==", selectedMedicId)
          .where("startTimestamp", ">=", startOfDay)
          .where("startTimestamp", "<", endOfDay)
      )
      .get()
      .pipe(
        map((querySnapshot) => {
          const bookedTimes: Set<Date> = new Set();

          querySnapshot.forEach((doc) => {
            // Explicitly cast the type of doc.data()
            const data = doc.data() as { startTimestamp: Timestamp };
            const startTimestamp: Timestamp = data.startTimestamp;

            const appointmentDate: Date = startTimestamp.toDate();
            appointmentDate.setSeconds(0);
            appointmentDate.setMilliseconds(0);

            bookedTimes.add(appointmentDate);
          });

          return bookedTimes;
        })
      );
  }

  addApointment(appointmentData: Appointment) {
    const firebaseAppointmentData: FirebaseAppointment = {
      ...appointmentData,
      datetime: Timestamp.fromDate(appointmentData.datetime),
    };

    const collectionRef = this.firestore.collection("appointments");
    return from(collectionRef.add(firebaseAppointmentData));
  }

  getAppointmentsByUserId(userId: string) {
    return this.firestore
      .collection<FirebaseAppointment>("appointments", (ref) => ref.where("userId", "==", userId))
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
}
