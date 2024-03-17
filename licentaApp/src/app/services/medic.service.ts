import { Injectable } from "@angular/core";
import { Observable, catchError, combineLatest, from, map, switchMap, take, throwError } from "rxjs";
import { Medic } from "../models/medic";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
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

  getMedicByUserId(userId: string): Observable<Medic | null> {
    return this.firestore
      .collection<Medic>("medics", (ref) => ref.where("userId", "==", userId))
      .snapshotChanges()
      .pipe(
        map((medicsSnapshot) => {
          if (medicsSnapshot.length > 0) {
            const medic = medicsSnapshot[0].payload.doc.data() as Medic;
            const documentId = medicsSnapshot[0].payload.doc.id;
            medic.id = documentId;

            return medic;
          } else {
            return null;
          }
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  addMedic(medic: Medic): Observable<any> {
    console.log(medic);
    const collectionRef: AngularFirestoreCollection<Medic> = this.firestore.collection("medics");
    return from(collectionRef.add(medic));
  }

  editMedicByUserId(userId: string, medic: Medic): Observable<void> {
    return this.firestore
      .collection<Medic>("medics", (ref) => ref.where("userId", "==", userId))
      .snapshotChanges()
      .pipe(
        take(1),
        switchMap((medicsSnapshot) => {
          const documentId = medicsSnapshot[0]?.payload.doc.id;
          if (!documentId) {
            // Handle the case where no document is found for the given userId
            return throwError(() => new Error("No matching document found for the provided userId"));
          }

          const medicDocRef: AngularFirestoreDocument<Medic> = this.firestore.collection("medics").doc(documentId);
          return from(medicDocRef.update(medic));
        }),
        catchError((error) => {
          // Handle any errors that occur during the process
          console.error("Error updating medic:", error);
          return throwError(() => error);
        })
      );
  }

  updateMedicVisibility(userId: string, isVisible: boolean): Observable<void> {
    return this.firestore
      .collection<Medic>("medics", (ref) => ref.where("userId", "==", userId))
      .snapshotChanges()
      .pipe(
        take(1),
        switchMap((medicsSnapshot) => {
          const documentId = medicsSnapshot[0]?.payload.doc.id;
          if (!documentId) {
            return throwError(() => new Error("No matching document found for the provided userId"));
          }

          const medicDocRef: AngularFirestoreDocument<Medic> = this.firestore.collection("medics").doc(documentId);

          return from(medicDocRef.update({ isVisible: isVisible }));
        }),
        catchError((error) => {
          console.error("Error updating medic field:", error);
          return throwError(() => error);
        })
      );
  }
}
