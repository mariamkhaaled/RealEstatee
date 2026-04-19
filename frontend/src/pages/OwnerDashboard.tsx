import { useEffect, useMemo, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import {
  Building,
  Eye,
  Heart,
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/StatCard";
import { getInquiries, type InquiryItem } from "@/api/inquiries";
import { getInquiryMessages, sendMessage, type MessageItem } from "@/api/messages";
import { connectSocket } from "@/lib/socket";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddPropertyModal from "./AddPropertyPage";

type PropertyType = {
  property_id: number;
  title: string;
  description: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  listing_id: number;
  purpose: string;
  price: string | number;
  status: string;
  views: number;
  city: string;
  address: string;
  images: string[];
  features: string[];
};

const OwnerDashboard = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("properties");

  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const isOwner = Boolean(user && user.role === "owner");
  const ownerId = user?.user_id || user?.id;

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (err instanceof Error && err.message) {
      return err.message;
    }
    return fallback;
  };

  const fetchOwnerProperties = async () => {
    if (!ownerId) {
      return;
    }

    try {
      setLoadingProperties(true);
      const res = await fetch(`http://localhost:5000/api/properties/owner/${ownerId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch properties");
      }

      setProperties(data?.data?.properties || []);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load properties"));
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    if (!isOwner || !ownerId) {
      return;
    }

    fetchOwnerProperties();
  }, [isOwner, ownerId]);

  useEffect(() => {
    const loadInquiries = async () => {
      if (!isOwner) {
        return;
      }

      try {
        setLoadingInquiries(true);
        const response = await getInquiries();
        setInquiries(response.data || []);
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load inquiries"));
      } finally {
        setLoadingInquiries(false);
      }
    };

    loadInquiries();
  }, [isOwner]);

  useEffect(() => {
    const inquiryId = Number(searchParams.get("inquiryId"));
    if (!inquiryId || inquiries.length === 0) {
      return;
    }

    const matched = inquiries.find((item) => item.inquiry_id === inquiryId);
    if (matched) {
      setActiveTab("inquiries");
      setSelectedInquiry(matched);
    }
  }, [inquiries, searchParams]);

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
        }
      } catch (err: unknown) {
        if (isActive) {
          setError(getErrorMessage(err, "Failed to load messages"));
        }
      } finally {
        if (isActive) {
          setLoadingMessages(false);
        }
      }
    };

    loadMessages();

    const currentSocket = connectSocket();
    currentSocket.emit("join", selectedInquiry.inquiry_id);

    const handleNewMessage = (message: MessageItem) => {
      if (message.inquiry_id === selectedInquiry.inquiry_id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    currentSocket.on("new_message", handleNewMessage);

    return () => {
      isActive = false;
      currentSocket.off("new_message", handleNewMessage);
    };
  }, [selectedInquiry]);

  const handleSend = async () => {
    if (!selectedInquiry || !messageText.trim()) {
      return;
    }

    if (!selectedInquiry.customer_id) {
      setError("This inquiry does not have a linked requester account.");
      return;
    }

    try {
      setSending(true);
      setError("");
      await sendMessage({
        inquiry_id: selectedInquiry.inquiry_id,
        receiver_id: selectedInquiry.customer_id,
        content: messageText.trim(),
      });
      setMessageText("");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to send message"));
    } finally {
      setSending(false);
    }
  };

  const openInquiryChat = (inquiry: InquiryItem) => {
    setSelectedInquiry(inquiry);
    setActiveTab("inquiries");
    setError("");
  };

  const handleStatusUpdate = (inquiryId: number, nextStatus: "Accepted" | "Rejected") => {
    setInquiries((prev) =>
      prev.map((item) =>
        item.inquiry_id === inquiryId ? { ...item, status: nextStatus } : item,
      ),
    );

    setSelectedInquiry((prev) => {
      if (!prev || prev.inquiry_id !== inquiryId) {
        return prev;
      }
      return { ...prev, status: nextStatus };
    });
  };

  const formatDate = (dateValue: string) =>
    new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatPrice = (price?: number | string) => {
    const normalized = Number(price);
    if (!Number.isFinite(normalized)) {
      return "-";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(normalized);
  };

  const getPropertyImage = (images: string[] = []) => {
    const raw = images[0];
    if (!raw) {
      return "https://via.placeholder.com/100x100?text=No+Image";
    }
    if (raw.startsWith("http")) {
      return raw;
    }
    return `http://localhost:5000${raw}`;
  };

  const currentUserId = Number(user?.id || user?.user_id || 0);
  const activeListingsCount = properties.filter((p) => p.status === "Active").length;
  const totalViews = properties.reduce((sum, p) => sum + Number(p.views || 0), 0);
  const totalInquiries = inquiries.length;

  if (!isOwner) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.96),_transparent_32%),linear-gradient(135deg,_#f7f3ed_0%,_#edf4fb_46%,_#f8f2ea_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-[#cfe2ef]/70 blur-3xl" />
        <div className="absolute right-0 top-20 h-[28rem] w-[28rem] rounded-full bg-[#eadfce]/70 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/4 h-64 w-64 rounded-full bg-[#d8e8dd]/50 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-900 via-slate-500 to-transparent" />
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br from-slate-900/5 to-transparent blur-2xl" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">LuxeEstates</p>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Management Center
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  A quiet, polished workspace for your properties, inquiry requests, and real-time conversations.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setOpenAddModal(true)}
                className="rounded-full bg-slate-900 text-white shadow-[0_12px_28px_rgba(15,23,42,0.2)] hover:bg-slate-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
              <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                Live inquiry feed
              </span>
              <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                Real-time chat
              </span>
              <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                Minimal layout
              </span>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 shadow-sm backdrop-blur">
            {error}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Active Listings" value={String(activeListingsCount)} icon={Building} trend="0%" />
          <StatCard title="Total Views" value={String(totalViews)} icon={Eye} trend="0%" />
          <StatCard title="Total Inquiries" value={String(totalInquiries)} icon={Heart} trend="0%" />
        </section>

        <Card className="overflow-hidden border border-white/70 bg-white/75 shadow-[0_28px_90px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <CardContent className="p-4 sm:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-6">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <TabsList className="h-12 rounded-full border border-slate-200 bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                  <TabsTrigger value="properties" className="rounded-full px-4 text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                    My Properties
                  </TabsTrigger>
                  <TabsTrigger value="inquiries" className="rounded-full px-4 text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                    Inquiry Requests
                  </TabsTrigger>
                </TabsList>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Minimal workspace</p>
              </div>

              <TabsContent value="properties" className="pt-2">
                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                  <div className="overflow-x-auto">
                    {loadingProperties ? (
                      <div className="px-6 py-8 text-sm text-slate-500">Loading properties...</div>
                    ) : properties.length === 0 ? (
                      <div className="px-6 py-8 text-sm text-slate-500">No properties found.</div>
                    ) : (
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-gradient-to-r from-[#f8f6f2] via-white to-[#f4f7fb] text-slate-500">
                          <tr>
                            <th className="px-6 py-4 font-medium uppercase tracking-[0.16em]">Property</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-[0.16em]">Purpose</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-[0.16em]">Price</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-[0.16em]">Status</th>
                            <th className="px-6 py-4 font-medium uppercase tracking-[0.16em]">Views</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {properties.map((property) => (
                            <tr key={property.property_id} className="transition duration-200 hover:bg-slate-50/80 hover:shadow-sm">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={getPropertyImage(property.images)}
                                    alt={property.title}
                                    className="h-12 w-12 rounded-xl object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-slate-900">{property.title}</p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                                      {property.city || "-"}, {property.address || "-"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-slate-700">{property.purpose}</td>
                              <td className="px-6 py-4 font-medium text-slate-900">{formatPrice(property.price)}</td>
                              <td className="px-6 py-4">
                                <Badge
                                  className={
                                    property.status === "Active"
                                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                      : "border border-amber-200 bg-amber-50 text-amber-700"
                                  }
                                >
                                  {property.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-slate-700">{property.views}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="inquiries" className="pt-2">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
                  <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                    <div className="border-b border-slate-200 bg-gradient-to-r from-[#f8f6f2] via-white to-[#f4f7fb] px-5 py-4">
                      <h2 className="text-lg font-semibold text-slate-900">Inquiry Requests</h2>
                      <p className="text-sm text-slate-500">
                        Track each request status and start a live conversation in one place.
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      {loadingInquiries ? (
                        <div className="px-5 py-8 text-sm text-slate-500">Loading inquiries...</div>
                      ) : inquiries.length === 0 ? (
                        <div className="px-5 py-8 text-sm text-slate-500">No inquiries yet.</div>
                      ) : (
                        <table className="w-full min-w-[900px] text-left text-sm">
                          <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                            <tr>
                              <th className="px-5 py-4 font-medium uppercase tracking-[0.14em]">Listing</th>
                              <th className="px-5 py-4 font-medium uppercase tracking-[0.14em]">Requested By</th>
                              <th className="px-5 py-4 font-medium uppercase tracking-[0.14em]">Message</th>
                              <th className="px-5 py-4 font-medium uppercase tracking-[0.14em]">Date</th>
                              <th className="px-5 py-4 font-medium uppercase tracking-[0.14em]">Price</th>
                              <th className="px-5 py-4 font-medium uppercase tracking-[0.14em]">Status</th>
                              <th className="px-5 py-4 font-medium uppercase tracking-[0.14em]">Actions</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-200 bg-white">
                            {inquiries.map((inquiry) => {
                              const isSelected = selectedInquiry?.inquiry_id === inquiry.inquiry_id;
                              const snippet =
                                inquiry.message.length > 55
                                  ? `${inquiry.message.slice(0, 55)}...`
                                  : inquiry.message;

                              return (
                                <tr
                                  key={inquiry.inquiry_id}
                                  className={`transition ${isSelected ? "bg-slate-50" : "hover:bg-slate-50/70"}`}
                                >
                                  <td className="px-5 py-4">
                                    <p className="font-semibold text-slate-900">{inquiry.property_title}</p>
                                    <p className="mt-1 text-xs text-slate-500">#{inquiry.inquiry_id}</p>
                                  </td>

                                  <td className="px-5 py-4">
                                    <p className="font-medium text-slate-900">{inquiry.name}</p>
                                    <p className="text-xs text-slate-500">{inquiry.email}</p>
                                  </td>

                                  <td className="px-5 py-4 text-slate-600">{snippet}</td>
                                  <td className="px-5 py-4 text-slate-600">{formatDate(inquiry.created_at)}</td>
                                  <td className="px-5 py-4 font-semibold text-slate-900">{formatPrice(inquiry.price)}</td>

                                  <td className="px-5 py-4">
                                    <Badge
                                      className={
                                        inquiry.status === "Accepted"
                                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                          : inquiry.status === "Rejected"
                                            ? "border border-rose-200 bg-rose-50 text-rose-700"
                                            : "border border-amber-200 bg-amber-50 text-amber-700"
                                      }
                                    >
                                      {inquiry.status}
                                    </Badge>
                                  </td>

                                  <td className="px-5 py-4">
                                    <div className="flex flex-wrap gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openInquiryChat(inquiry)}
                                        className="rounded-full"
                                      >
                                        View
                                      </Button>

                                      <Button
                                        size="sm"
                                        onClick={() => handleStatusUpdate(inquiry.inquiry_id, "Accepted")}
                                        className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                                      >
                                        <CheckCircle2 className="mr-1 h-4 w-4" />
                                        Accept
                                      </Button>

                                      <Button
                                        size="sm"
                                        onClick={() => handleStatusUpdate(inquiry.inquiry_id, "Rejected")}
                                        className="rounded-full bg-rose-600 text-white hover:bg-rose-700"
                                      >
                                        <XCircle className="mr-1 h-4 w-4" />
                                        Reject
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </section>

                  <aside className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                    {selectedInquiry ? (
                      <div className="flex min-h-[520px] flex-col">
                        <div className="border-b border-slate-200 bg-gradient-to-r from-[#f8f6f2] via-white to-[#f4f7fb] px-5 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h2 className="text-lg font-semibold text-slate-900">{selectedInquiry.name}</h2>
                              <p className="text-sm text-slate-500">{selectedInquiry.property_title}</p>
                            </div>
                            <Badge
                              className={
                                selectedInquiry.status === "Accepted"
                                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : selectedInquiry.status === "Rejected"
                                    ? "border border-rose-200 bg-rose-50 text-rose-700"
                                    : "border border-amber-200 bg-amber-50 text-amber-700"
                              }
                            >
                              {selectedInquiry.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex-1 space-y-4 overflow-auto px-5 py-5">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 shadow-sm">
                            <p className="font-medium text-slate-900">Inquiry details</p>
                            <p className="mt-2">{selectedInquiry.message}</p>
                            <p className="mt-3 text-xs text-slate-400">
                              {selectedInquiry.email} | {selectedInquiry.phone} | {formatDate(selectedInquiry.created_at)}
                            </p>
                          </div>

                          {loadingMessages ? (
                            <div className="text-sm text-slate-500">Loading chat...</div>
                          ) : messages.length === 0 ? (
                            <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
                              <div>
                                <MessageSquare className="mx-auto mb-3 h-6 w-6" />
                                <p>No messages yet. Start the conversation.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {messages.map((message) => {
                                const isMine = Number(message.sender_id) === currentUserId;
                                return (
                                  <div
                                    key={message.message_id}
                                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                  >
                                    <div
                                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                        isMine
                                          ? "bg-slate-900 text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)]"
                                          : "bg-slate-100 text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                                      }`}
                                    >
                                      <p>{message.content}</p>
                                      <p className={`mt-2 text-[11px] ${isMine ? "text-slate-300" : "text-slate-500"}`}>
                                        {isMine ? "You" : message.sender_name || "Requester"}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div className="border-t border-slate-200 bg-white p-4">
                          {selectedInquiry.customer_id ? (
                            <div className="space-y-3">
                              <Input
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Write a reply..."
                                className="rounded-2xl border-slate-200 bg-white shadow-sm"
                              />
                              <Button
                                onClick={handleSend}
                                disabled={sending || !messageText.trim()}
                                className="w-full rounded-2xl bg-slate-900 text-white shadow-[0_16px_35px_rgba(15,23,42,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-slate-800"
                              >
                                <Send className="mr-2 h-4 w-4" />
                                {sending ? "Sending..." : "Send message"}
                              </Button>
                            </div>
                          ) : (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                              This inquiry has no linked requester account, so chat is read-only.
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-h-[520px] items-center justify-center px-6 text-center text-sm text-slate-500">
                        Select an inquiry to open the side chat panel.
                      </div>
                    )}
                  </aside>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
          <DialogContent className="fixed top-[50%] left-[50%] z-50 w-[95vw] max-w-6xl max-h-[90vh] translate-x-[-50%] translate-y-[-50%] bg-white">
            <AddPropertyModal
              onClose={() => setOpenAddModal(false)}
              onSave={() => {
                setActiveTab("properties");
                fetchOwnerProperties();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OwnerDashboard;
