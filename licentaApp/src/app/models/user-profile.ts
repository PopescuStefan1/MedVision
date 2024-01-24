export interface UserProfile {
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  sex?: string;
  dateOfBirth?: Date;
  address?: {
    street?: string;
    country?: string;
    state?: string;
    city?: string;
    postalCode?: string;
  };
  nationality?: string;
}
