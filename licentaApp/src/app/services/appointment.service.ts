import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable, map } from "rxjs";

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
            const city: string = (doc.data() as { city: string }).city;

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
      .collection("medics")
      .get()
      .pipe(
        map((querySnapshot) => {
          const specialties: string[] = [];

          querySnapshot.forEach((doc) => {
            const specialty: string = (doc.data() as { specialty: string }).specialty;
            const city: string = (doc.data() as { city: string }).city;

            if (selectedCity === city && !specialties.includes(specialty)) {
              specialties.push(specialty);
            }
          });

          return specialties;
        })
      );
  }
}
