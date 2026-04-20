import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { MessageSquare, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMyInquiries, type InquiryItem } from "@/api/inquiries";
import {
  getInquiryMessages,
  getUnreadCounts,
  markInquiryAsRead,
  sendMessage,
  type MessageItem,
} from "@/api/messages";
import { connectSocket } from "@/lib/socket";

const MyInquiries = () => {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(
    null,
  );
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [unreadByInquiry, setUnreadByInquiry] = useState<
    Record<number, number>
  >({});
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const isUser = Boolean(user && user.role !== "admin");
  const currentUserId = Number(user?.id || user?.user_id || 0);

  useEffect(() => {
    const loadInquiries = async () => {
      try {
        setLoadingInquiries(true);
        const response = await getMyInquiries();
        setInquiries(response.data || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load inquiries");
        }
      } finally {
        setLoadingInquiries(false);
      }
    };

    if (isUser) {
      loadInquiries();
    }
  }, [isUser]);

  useEffect(() => {
    const loadUnreadCounts = async () => {
      if (!isUser) {
        return;
      }

      try {
        const response = await getUnreadCounts();
        const nextCounts: Record<number, number> = {};

        (response.data || []).forEach((row) => {
          nextCounts[Number(row.inquiry_id)] = Number(row.unread_count) || 0;
        });

        setUnreadByInquiry(nextCounts);
      } catch {
        // Ignore background unread load failures
      }
    };

    loadUnreadCounts();
  }, [isUser]);

  useEffect(() => {
    if (!selectedInquiry) {
      setMessages([]);
      return;
    }

    let isActive = true;

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const response = await getInquiryMessages(selectedInquiry.inquiry_id);
        if (isActive) {
          setMessages(response.data || []);
          await markInquiryAsRead(selectedInquiry.inquiry_id);
          setUnreadByInquiry((prev) => ({
            ...prev,
            [selectedInquiry.inquiry_id]: 0,
          }));
          window.dispatchEvent(new Event("unread-count-changed"));
        }
      } catch (err: unknown) {
        if (!isActive) {
          return;
        }

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load messages");
        }
      } finally {
        if (isActive) {
          setLoadingMessages(false);
        }
      }
    };

    loadMessages();

    return () => {
      isActive = false;
    };
  }, [selectedInquiry]);

  useEffect(() => {
    if (!isUser || inquiries.length === 0) {
      return;
    }

    const socket = connectSocket();
    inquiries.forEach((item) => {
      socket.emit("join", item.inquiry_id);
    });

    const handleNewMessage = (message: MessageItem) => {
      const inquiryId = Number(message.inquiry_id);
      const isCurrentOpen = selectedInquiry?.inquiry_id === inquiryId;
      const isForCurrentUser = Number(message.receiver_id) === currentUserId;

      if (isCurrentOpen) {
        setMessages((prev) => [...prev, message]);
      }

      if (isForCurrentUser) {
        if (isCurrentOpen) {
          markInquiryAsRead(inquiryId).catch(() => {
            // Ignore background mark-read failures
          });
          setUnreadByInquiry((prev) => ({
            ...prev,
            [inquiryId]: 0,
          }));
        } else {
          setUnreadByInquiry((prev) => ({
            ...prev,
            [inquiryId]: (prev[inquiryId] || 0) + 1,
          }));
        }

        window.dispatchEvent(new Event("unread-count-changed"));
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [inquiries, isUser, selectedInquiry?.inquiry_id, currentUserId]);

  useLayoutEffect(() => {
    if (!messagesEndRef.current) {
      return;
    }

    messagesEndRef.current.scrollIntoView({ block: "end", behavior: "auto" });
  }, [messages, selectedInquiry?.inquiry_id, loadingMessages]);

  const handleSend = async () => {
    if (!selectedInquiry || !messageText.trim()) {
      return;
    }

    if (!selectedInquiry.owner_id) {
      setError("Unable to identify owner for this inquiry.");
      return;
    }

    try {
      setSending(true);
      setError("");
      await sendMessage({
        inquiry_id: selectedInquiry.inquiry_id,
        receiver_id: Number(selectedInquiry.owner_id),
        content: messageText.trim(),
      });
      setMessageText("");
      requestAnimationFrame(() => {
        messageInputRef.current?.focus();
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send message");
      }
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateValue: string) =>
    new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatPrice = (value?: number) => {
    if (typeof value !== "number") {
      return "Price on request";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusLabel = (status: string) => {
    if (status === "Pending") {
      return "Pending Review";
    }

    if (status === "Accepted") {
      return "Accepted Request";
    }

    if (status === "Rejected") {
      return "Rejected Request";
    }

    return status;
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === "Accepted") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (status === "Rejected") {
      return "border-rose-200 bg-rose-50 text-rose-700";
    }

    if (status === "Pending" || status === "Reviewed") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-slate-300 bg-white text-slate-700";
  };

  const totalUnread = useMemo(
    () =>
      Object.values(unreadByInquiry).reduce(
        (sum, value) => sum + Number(value || 0),
        0,
      ),
    [unreadByInquiry],
  );

  const selectedPropertyImage = useMemo(() => {
    if (!selectedInquiry) {
      return "";
    }

    const inquiryWithImage = selectedInquiry as InquiryItem & {
      property_image?: string;
      property_image_url?: string;
      image_url?: string;
      image?: string;
    };

    return (
      inquiryWithImage.property_image_url ||
      inquiryWithImage.property_image ||
      inquiryWithImage.image_url ||
      inquiryWithImage.image ||
      ""
    );
  }, [selectedInquiry]);

  if (!isUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[linear-gradient(140deg,#f8fafc_0%,#eef4ff_52%,#f6f9ff_100%)] px-3 py-3 sm:px-4 sm:py-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 top-8 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute -right-28 bottom-8 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto h-[calc(100vh-96px)] max-w-[1400px] overflow-hidden rounded-[20px] border border-[#dfe6f1] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,251,255,0.88))] shadow-[0_18px_46px_rgba(37,99,235,0.08)] backdrop-blur-xl">
        {error && (
          <div className="absolute left-3 right-3 top-3 z-10 rounded-xl border border-rose-200/70 bg-rose-50/90 px-3 py-2 text-[11px] text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        <div className="grid h-full grid-cols-1 md:grid-cols-[35%_65%]">
          {/* LEFT: Inquiry Navigator */}
          <aside className="min-h-0 border-b border-[#E2E8F0] bg-[linear-gradient(180deg,#f8fbff_0%,#f5f8fd_100%)] md:border-b-0 md:border-r md:border-r-[#E2E8F0]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-white/35 px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-900/55">
                  Inquiry Navigator
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {inquiries.length} conversations
                </p>
              </div>
              <div className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-600 px-2 text-[10px] font-bold text-white">
                {totalUnread}
              </div>
            </div>

            {loadingInquiries ? (
              <div className="flex h-[calc(100%-66px)] items-center justify-center text-xs text-slate-500">
                Loading inquiries...
              </div>
            ) : inquiries.length === 0 ? (
              <div className="flex h-[calc(100%-66px)] items-center justify-center px-4 text-center text-xs text-slate-500">
                No inquiries yet.
              </div>
            ) : (
              <div className="h-[calc(100%-66px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/70 [&::-webkit-scrollbar-track]:bg-transparent">
                {inquiries.map((inquiry) => {
                  const isActive =
                    selectedInquiry?.inquiry_id === inquiry.inquiry_id;
                  const hasPrice = typeof inquiry.price === "number";

                  return (
                    <button
                      key={inquiry.inquiry_id}
                      type="button"
                      onClick={() => setSelectedInquiry(inquiry)}
                      className={`w-full border-b border-[#E2E8F0] px-5 py-4 text-left transition-all duration-150 ${
                        isActive
                          ? "bg-[linear-gradient(90deg,rgba(219,234,254,0.9),rgba(239,246,255,0.58))] shadow-[inset_3px_0_0_0_rgba(37,99,235,0.95)]"
                          : "bg-transparent hover:bg-[linear-gradient(90deg,rgba(241,245,249,0.7),rgba(248,250,252,0.55))]"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[12px] font-bold text-blue-700">
                          {inquiry.owner_name?.charAt(0) || "O"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[15px] font-semibold leading-5 text-slate-900 break-words">
                              {inquiry.owner_name || inquiry.name || "Owner"}
                            </p>
                            {(unreadByInquiry[inquiry.inquiry_id] || 0) > 0 && (
                              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                                {unreadByInquiry[inquiry.inquiry_id]}
                              </span>
                            )}
                          </div>

                          <p className="mt-1.5 text-[13px] font-medium leading-5 text-slate-700 break-words">
                            {inquiry.property_title}
                          </p>
                          <p
                            className={`mt-1 ${hasPrice ? "text-[12px] font-semibold text-blue-600" : "text-[11px] font-medium text-slate-500"}`}
                          >
                            {formatPrice(inquiry.price)}
                          </p>
                          <p className="mt-1.5 line-clamp-1 text-[12px] text-slate-600">
                            {inquiry.last_message_content || inquiry.message}
                          </p>

                          <div className="mt-3 flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.01em] ${getStatusBadgeClass(inquiry.status)}`}
                            >
                              {getStatusLabel(inquiry.status)}
                            </Badge>
                            <span className="text-[10px] text-slate-400">
                              {formatDate(inquiry.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          {/* RIGHT: Live Chat */}
          <section className="min-h-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]">
            {selectedInquiry ? (
              <div className="flex h-full flex-col">
                <header className="border-b border-[#E2E8F0] bg-gradient-to-r from-[#f5f9ff] via-white to-[#edf4ff] px-5 py-4">
                  <div className="flex items-center gap-3">
                    {selectedPropertyImage ? (
                      <img
                        src={selectedPropertyImage}
                        alt={selectedInquiry.property_title}
                        className="h-12 w-12 rounded-xl border border-[#E5E7EB] object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5E7EB] bg-gradient-to-br from-slate-100 to-slate-200 text-[12px] font-semibold text-slate-600">
                        {selectedInquiry.property_title?.charAt(0) || "P"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[16px] font-semibold text-slate-900">
                        {selectedInquiry.property_title}
                      </p>
                      <p className="truncate text-[13px] font-medium text-slate-500">
                        with{" "}
                        {selectedInquiry.owner_name ||
                          selectedInquiry.name ||
                          "Owner"}
                      </p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7e3f7] bg-blue-50 text-[11px] font-bold text-blue-700">
                      {(
                        selectedInquiry.owner_name ||
                        selectedInquiry.name ||
                        "O"
                      ).charAt(0)}
                    </div>
                  </div>
                </header>

                <div
                  ref={chatScrollRef}
                  className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,#ffffff_0%,#f3f8ff_100%)] px-4 py-5 md:px-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/70 [&::-webkit-scrollbar-track]:bg-transparent"
                >
                  <div className="max-w-[82%] rounded-2xl border border-[#dbe4f3] bg-[linear-gradient(180deg,#ffffff_0%,#f6f9ff_100%)] px-4 py-3 shadow-sm">
                    <p className="text-[12px] font-semibold text-slate-800">
                      Inquiry details
                    </p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-slate-700">
                      {selectedInquiry.message}
                    </p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {formatDate(selectedInquiry.created_at)}
                    </p>
                  </div>

                  {loadingMessages ? (
                    <p className="text-sm text-slate-500">
                      Loading messages...
                    </p>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-3 py-10 text-sm text-slate-500">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Start chatting with the owner
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => {
                        const isMe = Number(msg.sender_id) === currentUserId;
                        const senderName = isMe
                          ? "You"
                          : msg.sender_name ||
                            selectedInquiry.owner_name ||
                            "Owner";

                        return (
                          <div
                            key={msg.message_id}
                            className={`flex ${isMe ? "justify-end" : "justify-start gap-2.5"}`}
                          >
                            {!isMe && (
                              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[11px] font-semibold text-slate-600">
                                {senderName.charAt(0)}
                              </div>
                            )}

                            <div
                              className={`flex max-w-[80%] flex-col ${isMe ? "items-end" : "items-start"}`}
                            >
                              <div
                                className={`rounded-2xl border px-4 py-3 text-[14px] leading-relaxed ${
                                  isMe
                                    ? "border-blue-600 bg-[linear-gradient(180deg,#2563eb_0%,#1d4ed8_100%)] text-white"
                                    : "border-[#dbe4f3] bg-white text-slate-800 shadow-sm"
                                }`}
                              >
                                {!isMe && (
                                  <p className="mb-1.5 text-[12px] font-bold text-slate-700">
                                    {senderName}
                                  </p>
                                )}
                                {msg.content}
                              </div>
                              <p
                                className={`mt-1.5 text-[11px] ${isMe ? "text-slate-400" : "text-slate-500"}`}
                              >
                                {new Date(msg.created_at).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <footer className="sticky bottom-0 border-t border-[#E2E8F0] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] px-4 py-3 md:px-5">
                  <div className="flex items-center gap-2 rounded-2xl border border-[#dbe4f3] bg-white p-2 shadow-sm">
                    <Input
                      ref={messageInputRef}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Message..."
                      disabled={sending}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      className="h-10 border-0 bg-transparent px-2.5 text-[14px] placeholder:text-slate-400 focus-visible:ring-0"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={sending || !messageText.trim()}
                      className="h-10 rounded-xl bg-[linear-gradient(180deg,#3b82f6_0%,#2563eb_100%)] px-4 text-white hover:brightness-95"
                    >
                      <Send className="mr-1.5 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </footer>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center bg-[#f9fafb] px-6 text-center">
                <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-8">
                  <MessageSquare className="mx-auto h-6 w-6 text-slate-400" />
                  <p className="mt-2 text-xs font-semibold text-slate-700">
                    Select an inquiry
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Choose a conversation from the navigator.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyInquiries;
