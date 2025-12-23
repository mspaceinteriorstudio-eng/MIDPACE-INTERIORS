
export interface LineItem {
  id: string;
  description: string;
  brand: string;
  specification: string;
  quantity: number;
  unit: string;
  rate: number;
  taxPercent: number;
}

export interface Vendor {
  name: string;
  address: string;
  email: string;
  phone: string;
  gstin?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  location: string;
  projectName: string;
  preparedBy: string;
  vendor: Vendor;
  items: LineItem[];
  notes: string;
  terms: string;
  totalAmount: number;
  totalTax: number;
  grandTotal: number;
}

export const COMPANY_DETAILS = {
  name: "MIDSPACE INTERIORS",
  subHeader: "TRIVANDRUM, ATTINGAL, CHEMPOOR",
  address: "ATTINGAL POYKAMUKKU, MUDAKKAL.P.O.",
  city: "THIRUVANTHAPURAM",
  state: "KERALA",
  zip: "695103",
  contact: "+91 0000 000 000",
  email: "info@midspaceinteriors.com"
};
