import { Injectable } from "@angular/core";
import { Observable, catchError, combineLatest, map } from "rxjs";
import { Medic } from "../models/medic";
import { AngularFirestore } from "@angular/fire/compat/firestore";
@Injectable({
  providedIn: "root",
})
export class MedicService {
  constructor(private firestore: AngularFirestore) {}

  getAllMedics(): Observable<Medic[]> {
    return this.firestore
      .collection<Medic>("medics")
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          return snaps.map((snap) => {
            const data = snap.payload.doc.data() as Medic;
            const id = snap.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getMedicById(id: string): Observable<Medic> {
    return this.firestore.collection<Medic>("medics").doc(id).valueChanges() as Observable<Medic>;
  }

  getMedicsById(ids: string[]): Observable<Medic[]> {
    // Create an array of observables for each document
    const observables = ids.map((id) =>
      this.firestore
        .collection<Medic>("medics")
        .doc(id)
        .snapshotChanges()
        .pipe(
          map((doc) => {
            const data = doc.payload.data() as Medic;
            const id: string = doc.payload.id;
            return { id, ...data } as Medic;
          })
        )
    );

    // Combine all observables into one observable
    return combineLatest(observables);
  }

  getMedicByUserId(userId: string): Observable<Medic> {
    return this.firestore
      .collection<Medic>("medics", (ref) => ref.where("userId", "==", userId))
      .snapshotChanges()
      .pipe(
        // map((medics: Medic[]) => {
        //   if (medics.length > 0) {
        //     return medics[0];
        //   } else {
        //     throw new Error("Medic not found");
        //   }
        // })
        map((medicsSnapshot) => {
          if (medicsSnapshot.length > 0) {
            const medic = medicsSnapshot[0].payload.doc.data() as Medic;
            const documentId = medicsSnapshot[0].payload.doc.id;
            medic.id = documentId;

            return medic;
          } else {
            throw new Error("Medic not found");
          }
        }),
        catchError((error) => {
          console.error("Error fetching medic:", error);
          throw error;
        })
      );
  }
}
