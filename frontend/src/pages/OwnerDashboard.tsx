import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import {
  Building,
  Eye,
  Heart,
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  ArrowUpRight,
  Sparkles,
  Home,
  Activity,
  Bell,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatAvatar } from "@/components/ChatAvatar";
import {
  getInquiries,
  updateInquiryStatus,
  type InquiryItem,
} from "@/api/inquiries";
import {
  getInquiryMessages,
  getUnreadCounts,
  markInquiryAsRead,
  sendMessage,
  type MessageItem,
} from "@/api/messages";
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
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  );

  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(
    null,
  );
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadByInquiry, setUnreadByInquiry] = useState<
    Record<number, number>
  >({});

  const [error, setError] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [propertySearch, setPropertySearch] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<
    "All" | "Pending" | "Accepted" | "Rejected"
  >("All");
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);

  const scrollChatToBottom = () => {
    if (!chatScrollRef.current) {
      return;
    }

    requestAnimationFrame(() => {
      if (!chatScrollRef.current) {
        return;
      }
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    });
  };

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const isOwner = Boolean(user && user.role === "owner");
  const ownerId = user?.user_id || user?.id;
  const currentUserId = Number(user?.id || user?.user_id || 0);

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (err instanceof Error && err.message) {
      return err.message;
    }
    return fallback;
  };

  const fetchOwnerProperties = useCallback(async () => {
    if (!ownerId) {
      return;
    }

    try {
      setLoadingProperties(true);
      const res = await fetch(
        `http://localhost:5000/api/properties/owner/${ownerId}`,
      );
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
  }, [ownerId]);

  useEffect(() => {
    if (!isOwner || !ownerId) {
      return;
    }

    fetchOwnerProperties();
  }, [isOwner, ownerId, fetchOwnerProperties]);

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
    const loadUnreadCounts = async () => {
      if (!isOwner) {
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
        // Keep UI functional even if unread counts fail
      }
    };

    loadUnreadCounts();
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
          await markInquiryAsRead(selectedInquiry.inquiry_id);
          scrollChatToBottom();
          setUnreadByInquiry((prev) => ({
            ...prev,
            [selectedInquiry.inquiry_id]: 0,
          }));
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
        scrollChatToBottom();

        if (Number(message.receiver_id) === currentUserId) {
          markInquiryAsRead(selectedInquiry.inquiry_id).catch(() => {
            // Ignore background mark-read failures
          });
          setUnreadByInquiry((prev) => ({
            ...prev,
            [selectedInquiry.inquiry_id]: 0,
          }));
        }
      }
    };

    const handleInquiryStatusUpdated = (payload: {
      inquiry_id: number;
      status: InquiryItem["status"];
    }) => {
      setInquiries((prev) =>
        prev.map((item) =>
          item.inquiry_id === payload.inquiry_id
            ? { ...item, status: payload.status }
            : item,
        ),
      );

      setSelectedInquiry((prev) => {
        if (!prev || prev.inquiry_id !== payload.inquiry_id) {
          return prev;
        }
        return { ...prev, status: payload.status };
      });
    };

    currentSocket.on("new_message", handleNewMessage);
    currentSocket.on("inquiry_status_updated", handleInquiryStatusUpdated);

    return () => {
      isActive = false;
      currentSocket.off("new_message", handleNewMessage);
      currentSocket.off("inquiry_status_updated", handleInquiryStatusUpdated);
    };
  }, [selectedInquiry, currentUserId]);

  useLayoutEffect(() => {
    scrollChatToBottom();
  }, [messages, selectedInquiry?.inquiry_id]);

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
      requestAnimationFrame(() => {
        messageInputRef.current?.focus();
      });
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

  const handleStatusUpdate = async (
    inquiryId: number,
    nextStatus: "Accepted" | "Rejected",
  ) => {
    try {
      setError("");
      await updateInquiryStatus(inquiryId, nextStatus);

      setInquiries((prev) =>
        prev.map((item) =>
          item.inquiry_id === inquiryId
            ? { ...item, status: nextStatus }
            : item,
        ),
      );

      setSelectedInquiry((prev) => {
        if (!prev || prev.inquiry_id !== inquiryId) {
          return prev;
        }
        return { ...prev, status: nextStatus };
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to update inquiry status"));
    }
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

  const getStatusBadgeClass = (status: string) => {
    if (status === "Accepted") {
      return "border border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (status === "Rejected") {
      return "border border-rose-200 bg-rose-50 text-rose-700";
    }

    if (status === "Pending" || status === "Reviewed") {
      return "border border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border border-slate-300 bg-slate-50 text-slate-700";
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

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
        property.city.toLowerCase().includes(propertySearch.toLowerCase()) ||
        property.address.toLowerCase().includes(propertySearch.toLowerCase());

      const matchesStatus = showActiveOnly
        ? property.status === "Active"
        : true;
      return matchesSearch && matchesStatus;
    });
  }, [properties, propertySearch, showActiveOnly]);

  const filteredInquiries = useMemo(() => {
    if (inquiryStatusFilter === "All") {
      return inquiries;
    }
    return inquiries.filter((item) => item.status === inquiryStatusFilter);
  }, [inquiries, inquiryStatusFilter]);

  const selectedProperty = useMemo(
    () =>
      properties.find(
        (property) => property.property_id === selectedPropertyId,
      ) ||
      filteredProperties[0] ||
      properties[0] ||
      null,
    [filteredProperties, properties, selectedPropertyId],
  );

  const selectedPropertyInquiries = useMemo(() => {
    if (!selectedProperty?.listing_id) {
      return filteredInquiries;
    }

    return filteredInquiries.filter(
      (inquiry) =>
        Number(inquiry.listing_id) === Number(selectedProperty.listing_id),
    );
  }, [filteredInquiries, selectedProperty?.listing_id]);

  const totalUnread = useMemo(
    () =>
      Object.values(unreadByInquiry).reduce(
        (sum, value) => sum + Number(value || 0),
        0,
      ),
    [unreadByInquiry],
  );

  const activeListingsCount = properties.filter(
    (p) => p.status === "Active",
  ).length;

  useEffect(() => {
    if (!selectedPropertyId && filteredProperties.length > 0) {
      setSelectedPropertyId(filteredProperties[0].property_id);
    }
  }, [filteredProperties, selectedPropertyId]);
  const totalViews = properties.reduce(
    (sum, p) => sum + Number(p.views || 0),
    0,
  );
  const selectedPropertyUnread = selectedPropertyInquiries.reduce(
    (sum, inquiry) => sum + Number(unreadByInquiry[inquiry.inquiry_id] || 0),
    0,
  );
  const totalInquiries = inquiries.length;

  if (!isOwner) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-white px-0 py-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.98),_transparent_32%),linear-gradient(135deg,_#f7f3ed_0%,_#edf4fb_46%,_#f8f2ea_100%)]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-[#cfe2ef]/40 blur-3xl" />
        <div className="absolute right-0 top-20 h-[28rem] w-[28rem] rounded-full bg-[#eadfce]/40 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/4 h-64 w-64 rounded-full bg-[#d8e8dd]/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-full flex-col gap-6 px-10 py-8">
        {/* SLIM TOP BAR HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400 mb-1.5">
              LuxeEstates Owner Workspace
            </p>
            <h2 className="text-2xl font-light italic text-slate-700">
              A calmer, more cinematic control room.
            </h2>
          </div>
          <Button
            onClick={() => setOpenAddModal(true)}
            className="rounded-full bg-slate-950 text-white shadow-[0_16px_35px_rgba(15,23,42,0.22)] hover:bg-slate-800 h-11 px-6"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 shadow-sm backdrop-blur">
            {error}
          </div>
        )}

        <Card className="relative overflow-hidden border border-white/60 bg-white/55 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <CardContent className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="gap-6"
            >
              <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <TabsList className="h-12 rounded-full border border-white/80 bg-white/75 p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur">
                  <TabsTrigger
                    value="properties"
                    className="rounded-full px-4 text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    My Properties
                  </TabsTrigger>
                  <TabsTrigger
                    value="inquiries"
                    className="rounded-full px-4 text-sm data-[state=active]:bg-slate-900 data-[state=active]:text-white flex items-center gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    Inquiry Requests
                    {totalUnread > 0 ? (
                      <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold text-white">
                        {totalUnread}
                      </span>
                    ) : null}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="properties" className="pt-2">
                {/* 3-Column Layout: Left Navigator (25%) | Center Focus (50%) | Right Snapshots (25%) */}
                <div className="grid h-[78vh] min-h-[680px] gap-4 lg:grid-cols-[1fr_2fr_1fr]">
                  {/* LEFT COLUMN: Property Navigator Sidebar */}
                  <section className="flex flex-col overflow-hidden rounded-[34px] border border-white/65 bg-white/58 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                    <div className="border-b border-slate-200/60 bg-white/58 px-5 py-4">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                            Navigator
                          </p>
                          <h2 className="text-lg font-semibold text-slate-900">
                            Properties
                          </h2>
                        </div>
                        <Button
                          variant={showActiveOnly ? "default" : "outline"}
                          onClick={() => setShowActiveOnly((prev) => !prev)}
                          className="rounded-full shadow-sm text-xs h-8"
                        >
                          {showActiveOnly ? "Active" : "All"}
                        </Button>
                      </div>
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={propertySearch}
                          onChange={(e) => setPropertySearch(e.target.value)}
                          placeholder="Search..."
                          className="rounded-full border-slate-200/70 bg-white/88 pl-9 text-sm"
                        />
                      </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto p-3">
                      {loadingProperties ? (
                        <div className="px-3 py-6 text-sm text-slate-500">
                          Loading...
                        </div>
                      ) : filteredProperties.length === 0 ? (
                        <div className="px-3 py-6 text-sm text-slate-500">
                          No properties.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {filteredProperties.map((property) => {
                            const isSelected =
                              selectedProperty?.property_id ===
                              property.property_id;
                            return (
                              <button
                                key={property.property_id}
                                type="button"
                                onClick={() =>
                                  setSelectedPropertyId(property.property_id)
                                }
                                className={`w-full rounded-[20px] border p-2.5 text-left transition-all duration-300 ${
                                  isSelected
                                    ? "border-blue-300/50 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(90deg,_rgba(239,246,255,0.96),_rgba(255,255,255,0.95))] shadow-[0_12px_28px_rgba(59,130,246,0.10)]"
                                    : "border-slate-200/65 bg-white/72 hover:border-slate-300/70 hover:bg-white/88"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={getPropertyImage(property.images)}
                                    alt={property.title}
                                    className="h-12 w-12 rounded-2xl object-cover shadow-sm"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-slate-950">
                                      {property.title}
                                    </p>
                                    <p className="text-xs font-semibold text-slate-900">
                                      {formatPrice(property.price)}
                                    </p>
                                    <div className="mt-1 flex items-center gap-1">
                                      <span
                                        className={`h-1.5 w-1.5 rounded-full ${property.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`}
                                      />
                                      <span className="text-[10px] text-slate-500 uppercase tracking-[0.1em]">
                                        {property.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-200/60 bg-white/58 p-3">
                      <Button
                        onClick={() => setOpenAddModal(true)}
                        className="w-full rounded-full bg-slate-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] hover:bg-slate-800 text-sm h-9"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Property
                      </Button>
                    </div>
                  </section>

                  {/* CENTER COLUMN: Main Property Focus Area */}
                  <section className="flex flex-col gap-4 overflow-hidden rounded-[34px] border border-white/65 bg-white/58 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
                    {selectedProperty ? (
                      <>
                        {/* Large Cinematic Property Image with Glassmorphism Overlay */}
                        <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/80 shadow-[0_20px_55px_rgba(15,23,42,0.08)] flex-1">
                          <img
                            src={getPropertyImage(selectedProperty.images)}
                            alt={selectedProperty.title}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-transparent" />

                          {/* Glassmorphism Overlay Card - Left Side Centered */}
                          <div className="absolute bottom-4 right-4 w-fit max-w-[calc(100%-2rem)] min-w-[260px] rounded-[22px] border border-white/40 bg-white/28 px-4 py-3 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur-3xl sm:min-w-[300px]">
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0 max-w-[clamp(180px,55vw,560px)]">
                                <p className="text-[6px] uppercase tracking-[0.32em] text-slate-400 font-medium">
                                  Property Focus
                                </p>
                                <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-950 break-words leading-tight line-clamp-2">
                                  {selectedProperty.title}
                                </h3>
                              </div>
                              <Link
                                to={`/property-details/${selectedProperty.property_id}`}
                              >
                                <Button
                                  size="sm"
                                  className="rounded-full bg-slate-950/65 text-white border border-white/35 shadow-[0_10px_25px_rgba(15,23,42,0.14)] hover:bg-slate-950/85 hover:border-white/55 backdrop-blur-sm transition-all flex-shrink-0"
                                >
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-1 items-center justify-center rounded-[30px] border border-dashed border-slate-200 bg-white/70 text-sm text-slate-500">
                        Select a property to view
                      </div>
                    )}
                  </section>

                  {/* RIGHT COLUMN: Data Clarity + Live Activity */}
                  <section className="flex min-h-0 flex-col overflow-hidden rounded-[34px] border border-white/65 bg-white/58 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
                    {selectedProperty ? (
                      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
                        {/* TOP: Global Insights */}
                        <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.95),_rgba(242,248,255,0.86))] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                              Global Insights
                            </p>
                            <TrendingUp className="h-4 w-4 text-blue-500/75" />
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="rounded-full border border-white/75 bg-white/72 px-3 py-2 shadow-[0_6px_16px_rgba(59,130,246,0.06)] backdrop-blur-xl">
                              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                                Total Views
                              </p>
                              <p className="mt-1 text-lg font-black text-slate-950">
                                {totalViews}
                              </p>
                            </div>
                            <div className="rounded-full border border-white/75 bg-white/72 px-3 py-2 shadow-[0_6px_16px_rgba(59,130,246,0.06)] backdrop-blur-xl">
                              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                                Properties
                              </p>
                              <p className="mt-1 text-lg font-black text-slate-950">
                                {properties.length}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* MIDDLE: Property Performance */}
                        <div className="rounded-[24px] border border-white/70 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(135deg,_rgba(255,255,255,0.95),_rgba(239,246,255,0.9))] p-3 shadow-[0_12px_28px_rgba(59,130,246,0.08)]">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                            Property Performance
                          </p>
                          <p className="mt-1 truncate text-xs font-medium text-slate-600">
                            {selectedProperty.title}
                          </p>

                          <div className="mt-3 space-y-2">
                            <div className="rounded-[18px] border border-white/70 bg-white/70 px-3 py-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4 text-blue-500/80" />
                                  <div>
                                    <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">
                                      Villa Views
                                    </p>
                                    <p className="text-base font-black text-slate-950">
                                      {selectedProperty.views || 0}
                                    </p>
                                  </div>
                                </div>
                                <svg
                                  className="h-7 w-14"
                                  viewBox="0 0 100 32"
                                  preserveAspectRatio="none"
                                >
                                  <polyline
                                    points="0,24 18,22 36,19 54,14 72,16 100,9"
                                    fill="none"
                                    stroke="rgba(59,130,246,0.85)"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>

                            <div className="rounded-[18px] border border-white/70 bg-white/70 px-3 py-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4 text-blue-500/80" />
                                  <div>
                                    <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">
                                      Inquiries
                                    </p>
                                    <p className="text-base font-black text-slate-950">
                                      {selectedPropertyInquiries.length}
                                    </p>
                                  </div>
                                </div>
                                <svg
                                  className="h-7 w-14"
                                  viewBox="0 0 100 32"
                                  preserveAspectRatio="none"
                                >
                                  <polyline
                                    points="0,25 20,21 42,20 60,14 80,13 100,8"
                                    fill="none"
                                    stroke="rgba(37,99,235,0.85)"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>

                            <div className="rounded-[18px] border border-white/70 bg-white/70 px-3 py-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-blue-500/80" />
                                  <div>
                                    <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">
                                      Unread
                                    </p>
                                    <p className="text-base font-black text-slate-950">
                                      {selectedPropertyUnread}
                                    </p>
                                  </div>
                                </div>
                                <svg
                                  className="h-7 w-14"
                                  viewBox="0 0 100 32"
                                  preserveAspectRatio="none"
                                >
                                  <polyline
                                    points="0,23 20,24 40,20 60,18 80,11 100,12"
                                    fill="none"
                                    stroke="rgba(30,64,175,0.85)"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* BOTTOM: Live Activity Stream */}
                        <div className="min-h-0 flex flex-1 flex-col overflow-hidden rounded-[24px] border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.95),_rgba(242,248,255,0.87))] shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                          <div className="flex items-center justify-between border-b border-slate-200/60 px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <Bell className="h-3.5 w-3.5 text-blue-500" />
                              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                                Live Activity Stream
                              </p>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              Recent Updates
                            </span>
                          </div>

                          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/70 [&::-webkit-scrollbar-track]:bg-transparent">
                            {selectedPropertyInquiries.length === 0 ? (
                              <div className="mt-3 flex items-center justify-center rounded-[18px] border border-dashed border-slate-200 bg-white/75 px-4 py-6 text-xs text-slate-500">
                                No recent updates for this villa.
                              </div>
                            ) : (
                              <div className="space-y-2 pt-2">
                                {[...selectedPropertyInquiries]
                                  .sort(
                                    (a, b) =>
                                      new Date(b.created_at).getTime() -
                                      new Date(a.created_at).getTime(),
                                  )
                                  .map((inquiry) => (
                                    <div
                                      key={inquiry.inquiry_id}
                                      className="flex items-center gap-2.5 rounded-[16px] border border-white/70 bg-white/72 px-2.5 py-2 shadow-[0_6px_18px_rgba(59,130,246,0.05)]"
                                    >
                                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-white/80 bg-gradient-to-br from-blue-400/25 to-blue-500/18 text-[9px] font-bold text-blue-700">
                                        {inquiry.name?.charAt(0) || "U"}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-[11px] font-semibold text-slate-900">
                                          {inquiry.name || "Unknown user"}
                                        </p>
                                        <p className="text-[10px] text-slate-500">
                                          Sent a message •{" "}
                                          {formatDate(inquiry.created_at)}
                                        </p>
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className={`rounded-full px-2 py-0 text-[9px] font-medium ${getStatusBadgeClass(inquiry.status)}`}
                                      >
                                        {inquiry.status}
                                      </Badge>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-1 items-center justify-center px-4 py-6 text-center text-sm text-slate-500">
                        <div>
                          <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-slate-400">
                            Select Property
                          </p>
                          <p>
                            Choose a villa to view global insights, performance,
                            and activity.
                          </p>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              </TabsContent>

              <TabsContent value="inquiries" className="pt-2">
                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
                  <section className="flex flex-col overflow-hidden rounded-[34px] border border-white/65 bg-white/58 shadow-[0_18px_50px_rgba(15,23,42,0.06)] h-[70vh] min-h-[560px] max-h-[760px] backdrop-blur-2xl">
                    <div className="border-b border-slate-200/60 bg-white/58 px-5 py-4">
                      <h2 className="text-lg font-semibold text-slate-900">
                        Inquiry Requests
                      </h2>
                      <p className="text-sm text-slate-500">
                        Track each request status and start a live conversation
                        in one place.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(
                          ["All", "Pending", "Accepted", "Rejected"] as const
                        ).map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant={
                              inquiryStatusFilter === status
                                ? "default"
                                : "outline"
                            }
                            className="rounded-full shadow-sm"
                            onClick={() => setInquiryStatusFilter(status)}
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                      {loadingInquiries ? (
                        <div className="px-5 py-8 text-sm text-slate-500">
                          Loading inquiries...
                        </div>
                      ) : filteredInquiries.length === 0 ? (
                        <div className="px-5 py-8 text-sm text-slate-500">
                          No inquiries yet.
                        </div>
                      ) : (
                        <div className="space-y-3 p-3 pb-8">
                          {filteredInquiries.map((inquiry) => {
                            const isSelected =
                              selectedInquiry?.inquiry_id ===
                              inquiry.inquiry_id;
                            const snippet =
                              inquiry.message.length > 90
                                ? `${inquiry.message.slice(0, 90)}...`
                                : inquiry.message;

                            return (
                              <div
                                key={inquiry.inquiry_id}
                                className={`rounded-[28px] border p-4 transition-all duration-300 ${
                                  isSelected
                                    ? "border-blue-300/45 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(90deg,_rgba(239,246,255,0.96),_rgba(255,255,255,0.95))] shadow-[0_16px_35px_rgba(59,130,246,0.12)]"
                                    : "border-slate-200/65 bg-white/72 hover:border-slate-300/70 hover:bg-white/92 hover:shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
                                }`}
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <p className="font-semibold text-slate-900">
                                      {inquiry.property_title}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                      #{inquiry.inquiry_id} •{" "}
                                      {formatDate(inquiry.created_at)}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {(unreadByInquiry[inquiry.inquiry_id] ||
                                      0) > 0 ? (
                                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold text-white">
                                        {unreadByInquiry[inquiry.inquiry_id]}
                                      </span>
                                    ) : null}
                                    <Badge
                                      className={getStatusBadgeClass(
                                        inquiry.status,
                                      )}
                                    >
                                      {inquiry.status}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                  <span>{inquiry.name}</span>
                                  <span>{inquiry.email}</span>
                                  <span>{formatPrice(inquiry.price)}</span>
                                </div>

                                {inquiry.last_message_content ? (
                                  <div className="mt-3 space-y-1">
                                    <p className="text-sm text-slate-700 line-clamp-2 italic">
                                      "
                                      {inquiry.last_message_content.length > 90
                                        ? `${inquiry.last_message_content.slice(0, 90)}...`
                                        : inquiry.last_message_content}
                                      "
                                    </p>
                                    <p className="text-xs text-slate-400">
                                      {inquiry.last_message_sender_name ||
                                        "Requester"}{" "}
                                      •{" "}
                                      {inquiry.last_message_date
                                        ? formatDate(inquiry.last_message_date)
                                        : ""}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="mt-3 text-sm text-slate-600">
                                    {snippet}
                                  </p>
                                )}

                                <div className="mt-4 flex flex-wrap gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openInquiryChat(inquiry)}
                                    className="rounded-full"
                                    type="button"
                                  >
                                    Open Chat
                                  </Button>

                                  {inquiry.status === "Pending" ? (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleStatusUpdate(
                                            inquiry.inquiry_id,
                                            "Accepted",
                                          )
                                        }
                                        className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                                        type="button"
                                      >
                                        <CheckCircle2 className="mr-1 h-4 w-4" />
                                        Accept
                                      </Button>

                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleStatusUpdate(
                                            inquiry.inquiry_id,
                                            "Rejected",
                                          )
                                        }
                                        className="rounded-full bg-rose-600 text-white hover:bg-rose-700"
                                        type="button"
                                      >
                                        <XCircle className="mr-1 h-4 w-4" />
                                        Reject
                                      </Button>
                                    </>
                                  ) : (
                                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                                      Status finalized
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </section>

                  <aside className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] h-[70vh] min-h-[560px] max-h-[760px] lg:sticky lg:top-24">
                    {selectedInquiry ? (
                      <div className="flex h-full min-h-[520px] flex-col">
                        <div className="border-b border-slate-200 bg-gradient-to-r from-[#f8f6f2] via-white to-[#f4f7fb] px-5 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h2 className="text-lg font-semibold text-slate-900">
                                {selectedInquiry.name}
                              </h2>
                              <p className="text-sm text-slate-500">
                                {selectedInquiry.property_title}
                              </p>
                              <p className="mt-1 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-slate-400">
                                <Sparkles className="h-3.5 w-3.5" /> Live thread
                              </p>
                            </div>
                            <Badge
                              className={getStatusBadgeClass(
                                selectedInquiry.status,
                              )}
                            >
                              {selectedInquiry.status}
                            </Badge>
                          </div>
                        </div>

                        <div
                          ref={chatScrollRef}
                          className="flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-5"
                        >
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 shadow-sm">
                            <p className="font-medium text-slate-900">
                              Inquiry details
                            </p>
                            <p className="mt-2">{selectedInquiry.message}</p>
                            <p className="mt-3 text-xs text-slate-400">
                              {selectedInquiry.email} | {selectedInquiry.phone}{" "}
                              | {formatDate(selectedInquiry.created_at)}
                            </p>
                          </div>

                          {loadingMessages ? (
                            <div className="text-sm text-slate-500">
                              Loading chat...
                            </div>
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
                                const isMine =
                                  Number(message.sender_id) === currentUserId;
                                return (
                                  <div
                                    key={message.message_id}
                                    className={`flex ${isMine ? "justify-end" : "justify-start gap-2.5"}`}
                                  >
                                    {!isMine && (
                                      <ChatAvatar
                                        name={
                                          message.sender_name || "Requester"
                                        }
                                        size="md"
                                      />
                                    )}
                                    <div
                                      className={`max-w-[72%] flex flex-col ${isMine ? "items-end" : "items-start"}`}
                                    >
                                      {!isMine && (
                                        <p className="mb-1.5 text-xs font-medium text-slate-600">
                                          {message.sender_name || "Requester"}
                                        </p>
                                      )}
                                      <div
                                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                          isMine
                                            ? "bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)]"
                                            : "border border-slate-200 bg-white text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                                        }`}
                                      >
                                        <p>{message.content}</p>
                                      </div>
                                      <p
                                        className={`mt-1.5 text-[10px] ${isMine ? "text-slate-500" : "text-slate-400"}`}
                                      >
                                        {new Date(
                                          message.created_at,
                                        ).toLocaleTimeString("en-US", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
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
                            <div className="flex gap-2">
                              <Input
                                ref={messageInputRef}
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Write a reply..."
                                className="rounded-2xl border-slate-200 bg-white shadow-sm"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSend();
                                  }
                                }}
                              />
                              <Button
                                onClick={handleSend}
                                disabled={sending || !messageText.trim()}
                                className="rounded-xl"
                              >
                                <Send className="mr-2 h-4 w-4" />
                                {sending ? "Sending..." : "Send"}
                              </Button>
                            </div>
                          ) : (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                              This inquiry has no linked requester account, so
                              chat is read-only.
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
