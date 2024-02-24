export interface Appointment {
  medicId: string;
  userId: string;
  city: string;
  datetime: Date;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  comment?: string;
}
