import { Timestamp } from "firebase/firestore";

export interface FirebaseAppointment {
  medicId: string;
  patientUserId: string;
  city: string;
  datetime: Timestamp;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  comment?: string;
}
