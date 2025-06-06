export interface Item {
  id: string;
  name: string;
  barcode: string;
  category: string;
  location: string;
  quantity: number;
  description?: string;
  dateAdded: string;
  isLent: boolean;
  lendingInfo?: LendingInfo;
  image?: string; // URI for the image
}

export interface LendingInfo {
  borrower: string;
  location: string;
  dateLent: string;
  expectedReturn?: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
}