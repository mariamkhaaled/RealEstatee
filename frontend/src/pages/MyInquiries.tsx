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
  const [typingLabel, setTypingLabel] = useState("");
  const [unreadByInquiry, setUnreadByInquiry] = useState<
    Record<number, number>
  >({});
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const isUser = Boolean(user && user.role !== "admin");
  const currentUserId = Number(user?.id || user?.user_id || 0);
  const currentUserName =
    user?.name || user?.full_name || user?.username || "Customer";

  const emitTyping = (isTyping: boolean) => {
    if (!selectedInquiry?.inquiry_id) {
      return;
    }

    const socket = connectSocket();
    socket.emit("typing", {
      inquiryId: selectedInquiry.inquiry_id,
      userId: currentUserId,
      userName: currentUserName,
      isTyping,
    });
  };

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
      setTypingLabel("");
      return;
    }

    let isActive = true;

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const response = await getInquiryMessages(selectedInquiry.inquiry_id);
        if (isActive) {
          const fetchedMessages = response.data || [];

          // Create the initial inquiry message if it exists
          const initialMessage: MessageItem | null = selectedInquiry.message
            ? {
                message_id: 0, // Use 0 as a placeholder ID for the inquiry message
                inquiry_id: selectedInquiry.inquiry_id,
                sender_id: selectedInquiry.customer_id || 0,
                receiver_id: selectedInquiry.owner_id || 0,
                content: selectedInquiry.message,
                is_read: 1,
                created_at:
                  selectedInquiry.created_at || new Date().toISOString(),
                sender_name: selectedInquiry.name || "Customer",
              }
            : null;

          // Combine inquiry message with fetched messages
          const allMessages = initialMessage
            ? [initialMessage, ...fetchedMessages]
            : fetchedMessages;
          setMessages(allMessages);

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
        setTypingLabel("");
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

    const handleTyping = (payload: {
      inquiryId: number;
      userId: number;
      userName?: string;
      isTyping: boolean;
    }) => {
      if (Number(payload.inquiryId) !== selectedInquiry?.inquiry_id) {
        return;
      }

      if (Number(payload.userId) === currentUserId) {
        return;
      }

      if (payload.isTyping) {
        setTypingLabel("Typing");
      } else {
        setTypingLabel("");
      }
    };

    const handleMessagesRead = (payload: {
      inquiryId: number;
      readerId: number;
    }) => {
      if (Number(payload.inquiryId) !== selectedInquiry?.inquiry_id) {
        return;
      }

      setMessages((prev) =>
        prev.map((message) => {
          if (Number(message.receiver_id) !== Number(payload.readerId)) {
            return message;
          }

          return {
            ...message,
            is_read: 1,
          };
        }),
      );

      // Clear unread count for this inquiry and notify global listeners
      setUnreadByInquiry((prev) => ({
        ...prev,
        [Number(payload.inquiryId)]: 0,
      }));
      window.dispatchEvent(new Event("unread-count-changed"));
    };

    socket.on("new_message", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("messages_read", handleMessagesRead);
    };
  }, [inquiries, isUser, selectedInquiry?.inquiry_id, currentUserId]);

  useEffect(() => {
    setTypingLabel("");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (isTypingRef.current) {
      emitTyping(false);
      isTypingRef.current = false;
    }
  }, [selectedInquiry?.inquiry_id]);

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

      if (isTypingRef.current) {
        emitTyping(false);
        isTypingRef.current = false;
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

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

  const handleMessageTextChange = (value: string) => {
    setMessageText(value);

    if (!selectedInquiry?.inquiry_id) {
      return;
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // If there's text and we haven't emitted typing yet
    if (value.trim() && !isTypingRef.current) {
      isTypingRef.current = true;
      emitTyping(true);
    }

    // Set timeout to emit "stopped typing" after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        emitTyping(false);
      }
      typingTimeoutRef.current = null;
    }, 2000);
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

  const lastOutgoingMessageId = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (Number(messages[index].sender_id) === currentUserId) {
        return messages[index].message_id;
      }
    }

    return null;
  }, [messages, currentUserId]);

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
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#f6f3ee] px-3 py-3 sm:px-4 sm:py-4">
      {/* Luxury Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[26rem] w-[26rem] rounded-full bg-[#d9c7a2]/20 blur-3xl" />
        <div className="absolute right-[-8rem] bottom-[-6rem] h-[24rem] w-[24rem] rounded-full bg-[#cbb38b]/15 blur-3xl" />
      </div>

      <div className="relative mx-auto h-[calc(100vh-96px)] max-w-[1450px] overflow-hidden rounded-[34px] border border-[#e7dfd2] bg-[rgba(255,255,255,0.74)] shadow-[0_25px_70px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
        {error && (
          <div className="absolute left-4 right-4 top-4 z-10 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-[12px] text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        <div className="grid h-full grid-cols-1 md:grid-cols-[35%_65%]">
          {/* LEFT SIDEBAR */}
          <aside className="min-h-0 border-b border-[#ece5da] bg-[linear-gradient(180deg,#faf7f2_0%,#f7f2ea_100%)] md:border-b-0 md:border-r">
            <div className="flex items-center justify-between border-b border-[#ece5da] bg-white/40 px-6 py-5 backdrop-blur-xl">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#9f927d]">
                  Inquiry Navigator
                </p>
                <p className="mt-1 text-[18px] font-light text-[#2d2923]">
                  {inquiries.length} Conversations
                </p>
              </div>

              <div className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#dc2626] px-2 text-[11px] font-semibold text-white shadow-sm">
                {totalUnread}
              </div>
            </div>

            {loadingInquiries ? (
              <div className="flex h-[calc(100%-78px)] items-center justify-center text-sm text-[#8a8175]">
                Loading inquiries...
              </div>
            ) : inquiries.length === 0 ? (
              <div className="flex h-[calc(100%-78px)] items-center justify-center px-4 text-center text-sm text-[#8a8175]">
                No inquiries yet.
              </div>
            ) : (
              <div className="h-[calc(100%-78px)] overflow-y-auto px-3 py-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c8baa5]/70 [&::-webkit-scrollbar-track]:bg-transparent">
                <div className="space-y-2">
                  {inquiries.map((inquiry) => {
                    const isActive =
                      selectedInquiry?.inquiry_id === inquiry.inquiry_id;

                    return (
                      <button
                        key={inquiry.inquiry_id}
                        type="button"
                        onClick={() => setSelectedInquiry(inquiry)}
                        className={`w-full rounded-[24px] border px-4 py-4 text-left transition-all duration-300 ${
                          isActive
                            ? "border-[#d4c0a1] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,242,232,0.96))] shadow-[0_12px_30px_rgba(185,149,95,0.14)]"
                            : "border-[#ece5da] bg-white/72 hover:border-[#dcc8a8] hover:bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#eadfce] bg-[#f7f1e7] text-[12px] font-semibold text-[#8a6a3d]">
                            {inquiry.owner_name?.charAt(0) || "O"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-[15px] font-semibold leading-5 text-[#2b2823] break-words">
                                {inquiry.owner_name || inquiry.name || "Owner"}
                              </p>

                              {(unreadByInquiry[inquiry.inquiry_id] || 0) >
                                0 && (
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#dc2626] px-1 text-[10px] font-bold text-white">
                                  {unreadByInquiry[inquiry.inquiry_id]}
                                </span>
                              )}
                            </div>

                            <p className="mt-1.5 text-[13px] font-medium text-[#5f574c]">
                              {inquiry.property_title}
                            </p>

                            <p className="mt-1 text-[12px] font-semibold text-[#b8955f]">
                              {formatPrice(inquiry.price)}
                            </p>

                            <p className="mt-1.5 line-clamp-1 text-[12px] text-[#817667]">
                              {inquiry.last_message_content || inquiry.message}
                            </p>

                            <div className="mt-3 flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`rounded-full px-3 py-1 text-[11px] font-medium ${getStatusBadgeClass(
                                  inquiry.status,
                                )}`}
                              >
                                {getStatusLabel(inquiry.status)}
                              </Badge>

                              <span className="text-[10px] text-[#a09382]">
                                {formatDate(inquiry.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* RIGHT CHAT */}
          <section className="min-h-0 bg-[linear-gradient(180deg,#fcfaf7_0%,#f7f3ec_100%)]">
            {selectedInquiry ? (
              <div className="flex h-full flex-col">
                {/* HEADER */}
                <header className="border-b border-[#ece5da] bg-[linear-gradient(90deg,#faf6ef_0%,#ffffff_50%,#f7f2ea_100%)] px-6 py-5">
                  <div className="flex items-center gap-4">
                    {selectedPropertyImage ? (
                      <img
                        src={selectedPropertyImage}
                        alt={selectedInquiry.property_title}
                        className="h-14 w-14 rounded-2xl border border-[#eadfce] object-cover shadow-sm"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#eadfce] bg-[#f6f0e5] text-[13px] font-semibold text-[#8a6a3d]">
                        {selectedInquiry.property_title?.charAt(0) || "P"}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[18px] font-light text-[#2d2923]">
                        {selectedInquiry.property_title}
                      </p>

                      <p className="truncate text-[13px] text-[#8a8175]">
                        with{" "}
                        {selectedInquiry.owner_name ||
                          selectedInquiry.name ||
                          "Owner"}
                      </p>
                    </div>
                  </div>
                </header>

                {/* CHAT AREA */}
                <div
                  ref={chatScrollRef}
                  className="min-h-0 flex-1 overflow-y-auto px-5 py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c8baa5]/70 [&::-webkit-scrollbar-track]:bg-transparent"
                >
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const isMe = Number(msg.sender_id) === currentUserId;

                      return (
                        <div
                          key={msg.message_id}
                          className={`flex ${
                            isMe ? "justify-end" : "justify-start gap-2.5"
                          }`}
                        >
                          {!isMe && (
                            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[11px] font-semibold text-[#7b6d59]">
                              {(msg.sender_name || "O").charAt(0)}
                            </div>
                          )}

                          <div
                            className={`max-w-[78%] ${
                              isMe ? "items-end" : "items-start"
                            } flex flex-col`}
                          >
                            <div
                              className={`rounded-[22px] px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                                isMe
                                  ? "bg-[#b8955f] text-white"
                                  : "border border-[#ece5da] bg-white text-[#2d2923]"
                              }`}
                            >
                              {msg.content}
                            </div>

                            <p
                              className={`mt-1.5 text-[11px] ${
                                isMe ? "text-[#9b8c78]" : "text-[#a89b8b]"
                              }`}
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

                    {typingLabel && (
                      <div className="flex justify-start gap-2.5">
                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[11px] font-semibold text-[#7b6d59]">
                          {(selectedInquiry?.owner_name || "O").charAt(0)}
                        </div>
                        <div className="rounded-[22px] px-5 py-3 border border-[#ece5da] bg-white flex items-center gap-1.5">
                          <span
                            className="h-2.5 w-2.5 rounded-full bg-[#b8955f] animate-bounce"
                            style={{
                              animationDelay: "0s",
                              animationDuration: "1.4s",
                            }}
                          />
                          <span
                            className="h-2.5 w-2.5 rounded-full bg-[#b8955f] animate-bounce"
                            style={{
                              animationDelay: "0.2s",
                              animationDuration: "1.4s",
                            }}
                          />
                          <span
                            className="h-2.5 w-2.5 rounded-full bg-[#b8955f] animate-bounce"
                            style={{
                              animationDelay: "0.4s",
                              animationDuration: "1.4s",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div ref={messagesEndRef} />
                </div>

                {/* FOOTER */}
                <footer className="border-t border-[#ece5da] bg-[linear-gradient(180deg,#faf7f2_0%,#ffffff_100%)] px-5 py-4">
                  <div className="flex items-center gap-2 rounded-[24px] border border-[#eadfce] bg-white p-2 shadow-sm">
                    <Input
                      ref={messageInputRef}
                      value={messageText}
                      onChange={(e) => handleMessageTextChange(e.target.value)}
                      placeholder="Write a message..."
                      disabled={sending}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      className="h-11 border-0 bg-transparent px-3 text-[14px] placeholder:text-[#b1a28f] focus-visible:ring-0"
                    />

                    <Button
                      onClick={handleSend}
                      disabled={sending || !messageText.trim()}
                      className="h-11 rounded-[18px] bg-[#b8955f] px-5 text-white hover:bg-[#a7844d]"
                    >
                      <Send className="mr-1.5 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </footer>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center">
                <div className="rounded-[28px] border border-[#ece5da] bg-white/80 px-8 py-10 shadow-sm backdrop-blur">
                  <MessageSquare className="mx-auto h-7 w-7 text-[#b6a58d]" />

                  <p className="mt-3 text-sm font-medium text-[#3b352d]">
                    Select an inquiry
                  </p>

                  <p className="mt-1 text-[12px] text-[#8a8175]">
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
