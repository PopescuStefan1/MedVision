export interface Medic {
  id: number;
  name: string;
  title: string;
  shortTitle: string;
  specialty: string;
  city: string;
  patientIds: number[];
  photoUrl?: string;
}
