export interface Medic {
  id?: string;
  firstName: string;
  lastName: string;
  title: string;
  shortTitle: string;
  specialty: string;
  city: string;
  patientIds: number[];
  photoUrl?: string;
  email: string;
  phoneNumber: string;
  userId: string;
  isVisible: boolean;
}
