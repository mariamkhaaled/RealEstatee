export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: 'Apartment' | 'Villa' | 'Office' | 'House';
  purpose: 'Sale' | 'Rent' | 'Installment';
  beds: number;
  baths: number;
  sqft: number;
  images: string[];
  features: string[];
  ownerId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Owner' | 'Admin';
  avatar?: string;
}