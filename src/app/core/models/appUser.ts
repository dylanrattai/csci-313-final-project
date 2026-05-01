export interface AppUser {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'employee' | 'admin';
}
