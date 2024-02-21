import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Medic } from "../models/medic";
import { AngularFirestore } from "@angular/fire/compat/firestore";
@Injectable({
  providedIn: "root",
})
export class DataService {
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
}
