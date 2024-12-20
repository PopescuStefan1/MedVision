import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable, from, map } from "rxjs";
import { UserProfile } from "../models/user-profile";
import { doc } from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

  getUserData(docId: string): Observable<UserProfile> {
    const userDocRef = this.firestore.collection("users").doc(docId);

    return userDocRef.valueChanges().pipe(map((data) => (data ? this.convertTimestampsToDates(data) : data)));
  }

  updateUserData(userId: string, userData: any): Observable<void> {
    const userDocRef = this.firestore.collection("users").doc(userId);

    return from(userDocRef.update(userData));
  }

  private convertTimestampsToDates(data: any): any {
    if (data.hasOwnProperty("dateOfBirth")) {
      data.dateOfBirth = data.dateOfBirth.toDate();
    }

    return data;
  }
}
