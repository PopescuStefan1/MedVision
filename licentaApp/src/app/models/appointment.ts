export interface Appointment {
  medicId: string;
  userId: string;
  city: string;
  datetime: Date;
  firstName: string;
  lastName: string;
  age: number;
  sex: "Male" | "Female" | "Other";
  telephone: string;
  email: string;
  comment?: string;
  imgUrl?: string;
}
