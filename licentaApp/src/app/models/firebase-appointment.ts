import { Timestamp } from "firebase/firestore";

export interface FirebaseAppointment {
  medicId: string;
  userId: string;
  city: string;
  datetime: Timestamp;
  firstName: string;
  lastName: string;
  age: number;
  sex: "Male" | "Female" | "Other";
  telephone: string;
  email: string;
  comment?: string;
  imgUrl?: string;
}
