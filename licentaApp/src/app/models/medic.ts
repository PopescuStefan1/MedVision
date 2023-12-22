export interface Medic {
  id: string;
  name: string;
  title: string;
  shortTitle: string;
  specialty: string;
  city: string;
  patientIds: number[];
  photoUrl?: string;
  email: string;
  phoneNumber: string;
}
