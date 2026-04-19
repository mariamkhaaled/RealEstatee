import { fetchWrapper } from "./utils/fetchWrapper";

export interface InquiryItem {
  inquiry_id: number;
  listing_id: number;
  customer_id: number | null;
  owner_id?: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  property_title: string;
  price?: number;
  listing_status?: string;
  purpose?: string;
}

export interface CreateInquiryPayload {
  listing_id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const getInquiries = async () => {
  return fetchWrapper<InquiryItem[]>("/inquiries");
};

export const createInquiry = async (payload: CreateInquiryPayload) => {
  return fetchWrapper<{ inquiry_id: number }>("/inquiries", {
    method: "POST",
    body: payload,
  });
};
