export interface UserProfile {
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  sex?: string;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  nationality?: string;
}
