import { fetchWrapper } from "./utils/fetchWrapper";

export interface MessageItem {
  message_id: number;
  inquiry_id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: number;
  created_at: string;
  sender_name?: string;
}

export interface SendMessagePayload {
  inquiry_id: number;
  receiver_id: number;
  content: string;
}

export interface InquiryUnreadCount {
  inquiry_id: number;
  unread_count: number;
}

export const getInquiryMessages = async (inquiryId: number) => {
  return fetchWrapper<MessageItem[]>(`/messages/${inquiryId}`);
};

export const sendMessage = async (payload: SendMessagePayload) => {
  return fetchWrapper("/messages", {
    method: "POST",
    body: payload,
  });
};

export const getUnreadCounts = async () => {
  return fetchWrapper<InquiryUnreadCount[]>("/messages/unread-counts");
};

export const markInquiryAsRead = async (inquiryId: number) => {
  return fetchWrapper<{ inquiry_id: number }>(`/messages/${inquiryId}/read`, {
    method: "PATCH",
  });
};
