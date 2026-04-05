export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  beds: number;
  baths: number;
  area: number;
  type: 'Apartment' | 'Villa' | 'Office' | 'House';
  purpose: 'Sale' | 'Rent' | 'Installment';
  image: string;
  isFavorite?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Customer';
}