import { fetchWrapper } from "./utils/fetchWrapper";

export interface InquiryItem {
  inquiry_id: number;
  listing_id: number;
  customer_id: number | null;
  owner_id?: number;
  owner_name?: string;
  owner_email?: string;
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
  last_message_content?: string;
  last_message_date?: string;
  last_message_sender_name?: string;
}

export interface CreateInquiryPayload {
  listing_id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export type InquiryStatus = "Pending" | "Reviewed" | "Accepted" | "Rejected";

export const getInquiries = async () => {
  return fetchWrapper<InquiryItem[]>("/inquiries");
};

export const getMyInquiries = async () => {
  return fetchWrapper<InquiryItem[]>("/inquiries/mine");
};

export const createInquiry = async (payload: CreateInquiryPayload) => {
  return fetchWrapper<{ inquiry_id: number; reused?: boolean }>("/inquiries", {
    method: "POST",
    body: payload,
  });
};

export const updateInquiryStatus = async (
  inquiryId: number,
  status: InquiryStatus,
) => {
  return fetchWrapper<{ inquiry_id: number; status: InquiryStatus }>(
    `/inquiries/${inquiryId}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
};
