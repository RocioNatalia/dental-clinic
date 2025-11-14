export interface Pacient {
  id: number;
  name: string;
  lastName: string;
  phone: string;
  document: string;
  email: string;
  dateOfBirth: string; // ISO 8601: "YYYY-MM-DD"
  address: string;
}
