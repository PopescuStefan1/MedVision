export interface Appointment {
  medicId: string;
  patientId: string;
  city: string;
  startTimestamp: Date;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  comment?: string;
}
