import { Injectable } from "@angular/core";
import { Contact } from "../models/contact";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { Observable, from } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ContactService {
  constructor(private firestore: AngularFirestore) {}

  addContactData(contactData: Contact): Observable<any> {
    const collectionRef: AngularFirestoreCollection<Contact> = this.firestore.collection("contact");
    return from(collectionRef.add(contactData));
  }
}
