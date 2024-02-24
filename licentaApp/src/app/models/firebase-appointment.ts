import { Timestamp } from "firebase/firestore";

export interface FirebaseAppointment {
  medicId: string;
  userId: string;
  city: string;
  datetime: Timestamp;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  comment?: string;
}
