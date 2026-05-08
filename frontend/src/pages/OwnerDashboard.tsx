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
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
  Pencil,
  Trash2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  DollarSign,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  status: "Pending" | "Active" | "Closed";
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(
    null,
  );
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageText, setMessageText] = useState("");
  const [typingLabel, setTypingLabel] = useState("");
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadByInquiry, setUnreadByInquiry] = useState<
    Record<number, number>
  >({});

  const [error, setError] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyType | null>(
    null,
  );
  const [propertyToDelete, setPropertyToDelete] = useState<PropertyType | null>(
    null,
  );
  const [deletingProperty, setDeletingProperty] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [propertySearch, setPropertySearch] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<
    "All" | "Pending" | "Accepted" | "Rejected"
  >("All");
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  const currentUserName = user?.name || user?.full_name || "Owner";

  const emitTyping = useCallback(
    (isTyping: boolean) => {
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
    },
    [currentUserId, currentUserName, selectedInquiry?.inquiry_id],
  );

  const handleMessageTextChange = (value: string) => {
    setMessageText(value);
  };

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
    if (!isOwner) {
      return;
    }

    const syncInquiryPanel = async () => {
      try {
        const [inquiriesResponse, unreadResponse] = await Promise.all([
          getInquiries(),
          getUnreadCounts(),
        ]);

        setInquiries(inquiriesResponse.data || []);

        const nextCounts: Record<number, number> = {};
        (unreadResponse.data || []).forEach((row) => {
          nextCounts[Number(row.inquiry_id)] = Number(row.unread_count) || 0;
        });

        setUnreadByInquiry(nextCounts);
      } catch {
        // Ignore background sync failures to keep dashboard responsive
      }
    };

    window.addEventListener("unread-count-changed", syncInquiryPanel);

    return () => {
      window.removeEventListener("unread-count-changed", syncInquiryPanel);
    };
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
      setTypingLabel("");
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
      const inquiryId = Number(message.inquiry_id);
      const isCurrentOpen = inquiryId === selectedInquiry.inquiry_id;
      const isForCurrentUser = Number(message.receiver_id) === currentUserId;

      if (isCurrentOpen) {
        setMessages((prev) => [...prev, message]);
        setTypingLabel("");
        scrollChatToBottom();

        if (isForCurrentUser) {
          markInquiryAsRead(selectedInquiry.inquiry_id).catch(() => {
            // Ignore background mark-read failures
          });
          setUnreadByInquiry((prev) => ({
            ...prev,
            [selectedInquiry.inquiry_id]: 0,
          }));
          window.dispatchEvent(new Event("unread-count-changed"));
        }
        return;
      }

      if (isForCurrentUser) {
        setUnreadByInquiry((prev) => ({
          ...prev,
          [inquiryId]: (prev[inquiryId] || 0) + 1,
        }));
        window.dispatchEvent(new Event("unread-count-changed"));
      }
    };

    const handleTyping = (payload: {
      inquiryId: number;
      userId: number;
      userName?: string;
      isTyping: boolean;
    }) => {
      if (Number(payload.inquiryId) !== selectedInquiry.inquiry_id) {
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
      if (Number(payload.inquiryId) !== selectedInquiry.inquiry_id) {
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
    currentSocket.on("typing", handleTyping);
    currentSocket.on("messages_read", handleMessagesRead);

    return () => {
      isActive = false;
      currentSocket.off("new_message", handleNewMessage);
      currentSocket.off("inquiry_status_updated", handleInquiryStatusUpdated);
      currentSocket.off("typing", handleTyping);
      currentSocket.off("messages_read", handleMessagesRead);
    };
  }, [selectedInquiry, currentUserId]);

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
  }, [emitTyping, selectedInquiry?.inquiry_id]);

  useLayoutEffect(() => {
    scrollChatToBottom();
  }, [messages, selectedInquiry?.inquiry_id]);

  useEffect(() => {
    if (!selectedInquiry?.inquiry_id) {
      return;
    }

    if (!messageText.trim()) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      if (isTypingRef.current) {
        emitTyping(false);
        isTypingRef.current = false;
      }

      return;
    }

    if (!isTypingRef.current) {
      emitTyping(true);
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        emitTyping(false);
        isTypingRef.current = false;
      }
    }, 1200);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [emitTyping, messageText, selectedInquiry?.inquiry_id]);

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

  const getPropertyImages = (images: string[] = []) => {
    if (!Array.isArray(images) || images.length === 0) {
      return ["https://via.placeholder.com/1200x720?text=No+Image"];
    }

    const normalizedImages = images
      .filter(Boolean)
      .map((raw) =>
        raw.startsWith("http") ? raw : `http://localhost:5000${raw}`,
      );

    return normalizedImages.length > 0
      ? normalizedImages
      : ["https://via.placeholder.com/1200x720?text=No+Image"];
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

  const selectedPropertyImages = useMemo(
    () => getPropertyImages(selectedProperty?.images || []),
    [selectedProperty?.images],
  );

  const totalUnread = useMemo(
    () =>
      inquiries.reduce(
        (sum, inquiry) =>
          sum + Number(unreadByInquiry[inquiry.inquiry_id] || 0),
        0,
      ),
    [inquiries, unreadByInquiry],
  );

  const lastOutgoingMessageId = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (Number(messages[index].sender_id) === currentUserId) {
        return messages[index].message_id;
      }
    }

    return null;
  }, [messages, currentUserId]);

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

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProperty?.property_id]);

  const showPreviousImage = () => {
    if (selectedPropertyImages.length <= 1) {
      return;
    }

    setActiveImageIndex((prev) =>
      prev === 0 ? selectedPropertyImages.length - 1 : prev - 1,
    );
  };

  const showNextImage = () => {
    if (selectedPropertyImages.length <= 1) {
      return;
    }

    setActiveImageIndex((prev) => (prev + 1) % selectedPropertyImages.length);
  };

  const escapeCsvCell = (value: string | number | null | undefined) => {
    const normalized = String(value ?? "")
      .replace(/\r?\n|\r/g, " ")
      .trim();
    return `"${normalized.replace(/"/g, '""')}"`;
  };

  const handleExportData = () => {
    if (properties.length === 0) {
      setError("No properties available to export.");
      return;
    }

    try {
      setExporting(true);
      setError("");

      const headers = [
        "Property ID",
        "Title",
        "Type",
        "Purpose",
        "Status",
        "Price",
        "Bedrooms",
        "Bathrooms",
        "Area",
        "City",
        "Address",
        "Views",
        "Features",
        "Image Count",
      ];

      const rows = properties.map((property) => [
        property.property_id,
        property.title,
        property.property_type,
        property.purpose,
        property.status,
        property.price,
        property.bedrooms,
        property.bathrooms,
        property.area,
        property.city,
        property.address,
        property.views,
        (property.features || []).join(" | "),
        (property.images || []).length,
      ]);

      const csv = [
        headers.map((header) => escapeCsvCell(header)).join(","),
        ...rows.map((row) =>
          row
            .map((cell) =>
              escapeCsvCell(typeof cell === "number" ? String(cell) : cell),
            )
            .join(","),
        ),
      ].join("\n");

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `owner-properties-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to export properties data.");
    } finally {
      setExporting(false);
    }
  };

  const openEditPropertyModal = (property: PropertyType) => {
    setEditingProperty(property);
    setOpenEditModal(true);
  };

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) {
      return;
    }

    if (!ownerId) {
      setError("Unable to delete property without an owner account.");
      return;
    }

    try {
      setDeletingProperty(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/properties/${propertyToDelete.property_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            owner_id: ownerId,
          }),
        },
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || "Failed to delete property");
      }

      setProperties((prev) =>
        prev.filter(
          (property) => property.property_id !== propertyToDelete.property_id,
        ),
      );

      setSelectedPropertyId((prev) =>
        prev === propertyToDelete.property_id ? null : prev,
      );
      setPropertyToDelete(null);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete property"));
    } finally {
      setDeletingProperty(false);
    }
  };

  const openPropertyDeleteDialog = (property: PropertyType) => {
    setPropertyToDelete(property);
  };

  if (!isOwner) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#f8f5ef]">
      {/* Luxury Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_transparent_30%),linear-gradient(135deg,_#f8f5ef_0%,_#f4efe6_45%,_#efe7db_100%)]" />

      {/* Ambient Blurs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-[#d9c2a0]/25 blur-3xl" />
        <div className="absolute right-0 top-20 h-[28rem] w-[28rem] rounded-full bg-[#efe3d0]/30 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/4 h-64 w-64 rounded-full bg-[#c8a96e]/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-full flex-col gap-6 px-10 py-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#b8aa93] mb-1.5">
              LuxeEstates Owner Workspace
            </p>

            <h2
              className="text-3xl font-light text-[#2b2218]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Elegant Property Management
            </h2>
          </div>

          <Button
            onClick={handleExportData}
            disabled={exporting || properties.length === 0}
            className="rounded-full bg-[#6b5230] text-white hover:bg-[#2b241c] h-11 px-6 shadow-[0_18px_35px_rgba(31,26,20,0.18)]"
          >
            <Download className="mr-2 h-4 w-4" />
            {exporting ? "Exporting..." : "Export Data"}
          </Button>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {/* MAIN CONTAINER */}
        <Card className="relative overflow-hidden border border-[#eadfce] bg-white/85 backdrop-blur-2xl shadow-[0_35px_80px_rgba(95,74,47,0.08)] rounded-[36px]">
          <CardContent className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="gap-6"
            >
              {/* TOP TABS */}
              <div className="flex flex-col gap-4 border-b border-[#ede4d7] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <TabsList className="h-12 rounded-full border border-[#eadfce] bg-[#fcfaf7] p-1.5 shadow-sm">
                  <TabsTrigger
                    value="properties"
                    className="rounded-full px-5 text-sm data-[state=active]:bg-[#6b5230] data-[state=active]:text-white flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    My Properties
                  </TabsTrigger>

                  <TabsTrigger
                    value="inquiries"
                    className="rounded-full px-5 text-sm data-[state=active]:bg-[#6b5230] data-[state=active]:text-white flex items-center gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    Inquiry Requests
                    {totalUnread > 0 && (
                      <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#dc2626] px-1.5 text-[11px] font-semibold text-white">
                        {totalUnread}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* PROPERTIES TAB */}
              <TabsContent value="properties" className="pt-2">
                <div className="grid h-[78vh] min-h-[680px] gap-5 lg:grid-cols-[1fr_2fr_1fr]">
                  {/* LEFT SIDEBAR */}
                  <section className="flex h-full flex-col overflow-hidden rounded-[34px] border border-[#eadfce] bg-white/75 backdrop-blur-xl shadow-[0_18px_50px_rgba(95,74,47,0.06)]">
                    <div className="sticky top-0 z-20 border-b border-[#f1e7d8] bg-white/85 px-5 py-4">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b7a58c]">
                            Navigator
                          </p>

                          <h2
                            className="text-xl text-[#2b2218]"
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                            }}
                          >
                            Properties
                          </h2>
                        </div>

                        <Button
                          variant={showActiveOnly ? "default" : "outline"}
                          onClick={() => setShowActiveOnly((prev) => !prev)}
                          className="rounded-full text-xs h-8 border-[#e5d8c4]"
                        >
                          {showActiveOnly ? "Active" : "All"}
                        </Button>
                      </div>

                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b8aa93]" />

                        <Input
                          value={propertySearch}
                          onChange={(e) => setPropertySearch(e.target.value)}
                          placeholder="Search..."
                          className="rounded-full border-[#eadfce] bg-[#faf7f2] pl-9 text-sm"
                        />
                      </div>

                      <Button
                        onClick={() => setOpenAddModal(true)}
                        className="mt-3 w-full rounded-full bg-[#6b5230] text-white hover:bg-[#2b241c] text-sm h-9"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Property
                      </Button>
                    </div>

                    {/* PROPERTY LIST */}
                    <div className="min-h-0 h-full flex-1 overflow-y-auto p-3">
                      {filteredProperties.map((property) => {
                        const isSelected =
                          selectedProperty?.property_id ===
                          property.property_id;

                        return (
                          <div
                            key={property.property_id}
                            className={`mb-3 rounded-[24px] border p-3 transition-all duration-300 ${
                              isSelected
                                ? "border-[#d7b98f] bg-[#f8f3ea] shadow-[0_14px_30px_rgba(200,169,110,0.12)]"
                                : "border-[#eee4d7] bg-white hover:bg-[#fdfaf5]"
                            }`}
                          >
                            {/* FULL CARD ROW */}
                            <div className="flex items-center justify-between gap-3">
                              {/* LEFT (SELECT AREA) */}
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedPropertyId(property.property_id)
                                }
                                className="flex flex-1 items-center gap-3 text-left min-w-0"
                              >
                                <img
                                  src={getPropertyImage(property.images)}
                                  alt={property.title}
                                  className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                                />

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold text-[#2b2218]">
                                    {property.title}
                                  </p>

                                  <p className="text-sm font-semibold text-[#7b5e3b]">
                                    {formatPrice(property.price)}
                                  </p>

                                  <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#b7a58c]">
                                    {property.status}
                                  </p>
                                </div>
                              </button>

                              {/* RIGHT ACTIONS */}
                              <div className="flex shrink-0 items-center gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation(); // IMPORTANT: prevents card selection
                                    openEditPropertyModal(property);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>

                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openPropertyDeleteDialog(property);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* CENTER AREA */}
                  <section className="flex flex-col gap-4 overflow-hidden rounded-[34px] border border-[#eadfce] bg-white/75 p-5 backdrop-blur-xl shadow-[0_20px_60px_rgba(95,74,47,0.08)]">
                    {selectedProperty ? (
                      <div className="flex h-full min-h-0 flex-col justify-between gap-4">
                        {/* IMAGE */}
                        <div className="relative h-[580px] overflow-hidden rounded-[30px] border border-[#eadfce]">
                          {selectedPropertyImages.map((imageUrl, index) => (
                            <img
                              key={index}
                              src={imageUrl}
                              alt=""
                              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                                activeImageIndex === index
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                          ))}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

                          {selectedPropertyImages.length > 1 && (
                            <>
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={showPreviousImage}
                                className="absolute left-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border-white/30 bg-white/20 text-white backdrop-blur-xl hover:bg-white hover:text-[#2b2218]"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>

                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={showNextImage}
                                className="absolute right-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border-white/30 bg-white/20 text-white backdrop-blur-xl hover:bg-white hover:text-[#2b2218]"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </>
                          )}

                          {/* OVERLAY CARD */}
                          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-3">
                            <div className="max-w-[22rem] rounded-xl border border-white/30 bg-white/20 px-3 py-2 shadow-[0_10px_25px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:max-w-[28rem]">
                              <p className="text-[9px] uppercase tracking-[0.2em] text-white/70">
                                Property Focus
                              </p>

                              <h3
                                className="mt-0.5 line-clamp-2 text-lg leading-tight text-white"
                                style={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                }}
                              >
                                {selectedProperty.title}
                              </h3>

                              <p className="mt-0.5 truncate text-xs text-white/70">
                                {selectedProperty.city}
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                              <Link
                                to={`/property-details/${selectedProperty.property_id}`}
                              >
                                <Button
                                  size="icon"
                                  className="h-9 w-9 rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#2b2218]"
                                >
                                  <ArrowUpRight className="h-4 w-4" />
                                </Button>
                              </Link>

                              {selectedPropertyImages.length > 1 && (
                                <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-2 backdrop-blur-xl">
                                  {selectedPropertyImages.map((_, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={() => setActiveImageIndex(index)}
                                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                                        activeImageIndex === index
                                          ? "bg-white shadow-[0_0_0_2px_rgba(255,255,255,0.25)]"
                                          : "bg-white/45 hover:bg-white/70"
                                      }`}
                                      aria-label={`Show property image ${index + 1}`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* DETAILS GRID */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {[
                            {
                              label: "Price",
                              value: formatPrice(selectedProperty.price),
                              icon: DollarSign,
                            },
                            {
                              label: "Location",
                              value: selectedProperty.city,
                              icon: MapPin,
                            },
                            {
                              label: "Type",
                              value: selectedProperty.property_type,
                              icon: Home,
                            },
                            {
                              label: "Bedrooms",
                              value: selectedProperty.bedrooms,
                              icon: Bed,
                            },
                            {
                              label: "Bathrooms",
                              value: selectedProperty.bathrooms,
                              icon: Bath,
                            },
                            {
                              label: "Area",
                              value: `${Number(
                                selectedProperty.area || 0,
                              ).toFixed(2)} sqft`,
                              icon: Maximize,
                            },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="rounded-2xl border border-[#eadfce] bg-[#fcfaf7] p-4"
                            >
                              <div className="flex items-center gap-2 text-[#b59b75] mb-1">
                                <item.icon className="h-3.5 w-3.5" />

                                <span className="text-[10px] uppercase tracking-[0.15em]">
                                  {item.label}
                                </span>
                              </div>

                              <p className="text-sm font-semibold text-[#2b2218]">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-1 items-center justify-center text-[#9f907c]">
                        Select a property to view
                      </div>
                    )}
                  </section>

                  {/* RIGHT PANEL */}

                  {/* RIGHT COLUMN: Data Clarity + Live Activity */}
                  <section className="flex min-h-0 flex-col overflow-hidden rounded-[30px] border border-[#eadfce] bg-white/75 backdrop-blur-xl shadow-[0_14px_40px_rgba(95,74,47,0.05)]">
                    {selectedProperty ? (
                      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
                        {/* TOP */}
                        <div className="rounded-[24px] border border-[#eadfce] bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(248,243,234,0.92))] p-3 shadow-[0_8px_20px_rgba(95,74,47,0.05)]">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-[9px] uppercase tracking-[0.22em] text-[#b7a58c]">
                                Global Insights
                              </p>

                              <h3
                                className="mt-0.5 text-lg text-[#2b2218]"
                                style={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                }}
                              >
                                Portfolio Snapshot
                              </h3>
                            </div>

                            <TrendingUp className="h-4 w-4 text-[#c8a96e]" />
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-[#eadfce] bg-[#fcfaf7] px-3 py-2.5">
                              <p className="text-[9px] uppercase tracking-[0.16em] text-[#b7a58c]">
                                Views
                              </p>

                              <p className="mt-1 text-xl font-bold text-[#2b2218]">
                                {totalViews}
                              </p>
                            </div>

                            <div className="rounded-xl border border-[#eadfce] bg-[#fcfaf7] px-3 py-2.5">
                              <p className="text-[9px] uppercase tracking-[0.16em] text-[#b7a58c]">
                                Properties
                              </p>

                              <p className="mt-1 text-xl font-bold text-[#2b2218]">
                                {properties.length}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* PERFORMANCE */}
                        <div className="rounded-[24px] border border-[#eadfce] bg-[radial-gradient(circle_at_top_right,_rgba(200,169,110,0.14),_transparent_28%),linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(248,243,234,0.92))] p-3 shadow-[0_10px_24px_rgba(95,74,47,0.05)]">
                          <p className="text-[9px] uppercase tracking-[0.22em] text-[#b7a58c]">
                            Property Performance
                          </p>

                          <p className="mt-1 truncate text-xs font-medium text-[#7b6a58]">
                            {selectedProperty.title}
                          </p>

                          <div className="mt-3 space-y-2">
                            {/* Views */}
                            <div className="rounded-[18px] border border-[#eadfce] bg-[#fcfaf7] px-3 py-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efe3d0]">
                                    <Eye className="h-3.5 w-3.5 text-[#7b5e3b]" />
                                  </div>

                                  <div>
                                    <p className="text-[9px] uppercase tracking-[0.16em] text-[#b7a58c]">
                                      Views
                                    </p>

                                    <p className="text-sm font-bold text-[#2b2218]">
                                      {selectedProperty.views || 0}
                                    </p>
                                  </div>
                                </div>

                                <svg
                                  className="h-6 w-12"
                                  viewBox="0 0 100 32"
                                  preserveAspectRatio="none"
                                >
                                  <polyline
                                    points="0,24 18,22 36,19 54,14 72,16 100,9"
                                    fill="none"
                                    stroke="rgba(123,94,59,0.85)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>

                            {/* Inquiries */}
                            <div className="rounded-[18px] border border-[#eadfce] bg-[#fcfaf7] px-3 py-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efe3d0]">
                                    <MessageSquare className="h-3.5 w-3.5 text-[#7b5e3b]" />
                                  </div>

                                  <div>
                                    <p className="text-[9px] uppercase tracking-[0.16em] text-[#b7a58c]">
                                      Inquiries
                                    </p>

                                    <p className="text-sm font-bold text-[#2b2218]">
                                      {selectedPropertyInquiries.length}
                                    </p>
                                  </div>
                                </div>

                                <svg
                                  className="h-6 w-12"
                                  viewBox="0 0 100 32"
                                  preserveAspectRatio="none"
                                >
                                  <polyline
                                    points="0,25 20,21 42,20 60,14 80,13 100,8"
                                    fill="none"
                                    stroke="rgba(200,169,110,0.85)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>

                            {/* Unread */}
                            <div className="rounded-[18px] border border-[#eadfce] bg-[#fcfaf7] px-3 py-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efe3d0]">
                                    <Building className="h-3.5 w-3.5 text-[#7b5e3b]" />
                                  </div>

                                  <div>
                                    <p className="text-[9px] uppercase tracking-[0.16em] text-[#b7a58c]">
                                      Unread
                                    </p>

                                    <p className="text-sm font-bold text-[#2b2218]">
                                      {selectedPropertyUnread}
                                    </p>
                                  </div>
                                </div>

                                <svg
                                  className="h-6 w-12"
                                  viewBox="0 0 100 32"
                                  preserveAspectRatio="none"
                                >
                                  <polyline
                                    points="0,23 20,24 40,20 60,18 80,11 100,12"
                                    fill="none"
                                    stroke="rgba(107,82,48,0.85)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* LIVE ACTIVITY */}
                        <div className="min-h-0 flex flex-1 flex-col overflow-hidden rounded-[24px] border border-[#eadfce] bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(248,243,234,0.92))] shadow-[0_8px_20px_rgba(95,74,47,0.05)]">
                          <div className="flex items-center justify-between border-b border-[#efe4d4] px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <Bell className="h-3.5 w-3.5 text-[#c8a96e]" />

                              <p className="text-[9px] uppercase tracking-[0.22em] text-[#b7a58c]">
                                Live Activity
                              </p>
                            </div>

                            <span className="text-[10px] text-[#b7a58c]">
                              Recent
                            </span>
                          </div>

                          <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-2.5 pt-2 space-y-2">
                            {selectedPropertyInquiries.length === 0 ? (
                              <div className="flex items-center justify-center rounded-[16px] border border-dashed border-[#eadfce] bg-[#fcfaf7] px-3 py-5 text-xs text-[#8f7d68]">
                                No inquiries yet.
                              </div>
                            ) : (
                              [...selectedPropertyInquiries]
                                .sort(
                                  (a, b) =>
                                    new Date(b.created_at).getTime() -
                                    new Date(a.created_at).getTime(),
                                )
                                .map((inquiry) => (
                                  <div
                                    key={inquiry.inquiry_id}
                                    className="flex items-center gap-2 rounded-[16px] border border-[#eadfce] bg-[#fcfaf7] px-2.5 py-2"
                                  >
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#efe3d0] text-[10px] font-bold text-[#7b5e3b]">
                                      {inquiry.name?.charAt(0) || "U"}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-[11px] font-semibold text-[#2b2218]">
                                        {inquiry.name || "Unknown"}
                                      </p>

                                      <p className="text-[10px] text-[#8f7d68]">
                                        {formatDate(inquiry.created_at)}
                                      </p>
                                    </div>

                                    <Badge
                                      variant="outline"
                                      className={`rounded-full px-2 py-0 text-[9px] ${getStatusBadgeClass(
                                        inquiry.status,
                                      )}`}
                                    >
                                      {inquiry.status}
                                    </Badge>
                                  </div>
                                ))
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-1 items-center justify-center px-5 py-6 text-center">
                        <div>
                          <p className="mb-2 text-[9px] uppercase tracking-[0.22em] text-[#b7a58c]">
                            Select Property
                          </p>

                          <p className="text-xs text-[#8f7d68]">
                            Choose a property to view insights.
                          </p>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              </TabsContent>

              <TabsContent value="inquiries" className="pt-2">
                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_520px]">
                  {/* LEFT PANEL */}
                  <section className="flex flex-col overflow-hidden rounded-[34px] border border-[#e7dfd2] bg-[rgba(255,255,255,0.72)] shadow-[0_25px_70px_rgba(0,0,0,0.08)] backdrop-blur-2xl h-[70vh] min-h-[560px] max-h-[760px]">
                    {/* HEADER */}
                    <div className="border-b border-[#ece5da] bg-[linear-gradient(180deg,#faf7f2_0%,#f7f2ea_100%)] px-5 py-4">
                      <h2 className="text-lg font-semibold text-[#2d2923]">
                        Inquiry Requests
                      </h2>

                      <p className="text-sm text-[#8a8175]">
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
                            className={`rounded-full shadow-sm ${
                              inquiryStatusFilter === status
                                ? "bg-[#b8955f] text-white hover:bg-[#a7844d]"
                                : "border-[#e7dfd2] text-[#6e6253] hover:bg-[#faf7f2]"
                            }`}
                            onClick={() => setInquiryStatusFilter(status)}
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* LIST */}
                    <div className="min-h-0 flex-1 overflow-y-auto">
                      {loadingInquiries ? (
                        <div className="px-5 py-8 text-sm text-[#8a8175]">
                          Loading inquiries...
                        </div>
                      ) : filteredInquiries.length === 0 ? (
                        <div className="px-5 py-8 text-sm text-[#8a8175]">
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
                                    ? "border-[#d4c0a1] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,242,232,0.96))] shadow-[0_16px_35px_rgba(185,149,95,0.14)]"
                                    : "border-[#ece5da] bg-white/70 hover:bg-white hover:border-[#dcc8a8]"
                                }`}
                              >
                                {/* TOP ROW */}
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <p className="font-semibold text-[#2d2923]">
                                      {inquiry.property_title}
                                    </p>

                                    <p className="mt-1 text-xs text-[#8a8175]">
                                      #{inquiry.inquiry_id} •{" "}
                                      {formatDate(inquiry.created_at)}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {(unreadByInquiry[inquiry.inquiry_id] ||
                                      0) > 0 && (
                                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#dc2626] px-1.5 text-[11px] font-semibold text-white">
                                        {unreadByInquiry[inquiry.inquiry_id]}
                                      </span>
                                    )}

                                    <Badge
                                      className={getStatusBadgeClass(
                                        inquiry.status,
                                      )}
                                    >
                                      {inquiry.status}
                                    </Badge>
                                  </div>
                                </div>

                                {/* META */}
                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8a8175]">
                                  <span>{inquiry.name}</span>
                                  <span>{inquiry.email}</span>
                                  <span className="text-[#b8955f] font-semibold">
                                    {formatPrice(inquiry.price)}
                                  </span>
                                </div>

                                {/* MESSAGE */}
                                {inquiry.last_message_content ? (
                                  <div className="mt-3 space-y-1">
                                    <p className="text-sm text-[#5f574c] line-clamp-2 italic">
                                      "
                                      {inquiry.last_message_content.length > 90
                                        ? `${inquiry.last_message_content.slice(0, 90)}...`
                                        : inquiry.last_message_content}
                                      "
                                    </p>

                                    <p className="text-xs text-[#a89b8b]">
                                      {inquiry.last_message_sender_name ||
                                        "Requester"}{" "}
                                      •{" "}
                                      {inquiry.last_message_date
                                        ? formatDate(inquiry.last_message_date)
                                        : ""}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="mt-3 text-sm text-[#6e6253]">
                                    {snippet}
                                  </p>
                                )}

                                {/* ACTIONS */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openInquiryChat(inquiry)}
                                    className="rounded-full border-[#e7dfd2] text-[#6e6253] hover:bg-[#faf7f2]"
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
                                      >
                                        <XCircle className="mr-1 h-4 w-4" />
                                        Reject
                                      </Button>
                                    </>
                                  ) : (
                                    <span className="inline-flex items-center rounded-full border border-[#e7dfd2] bg-[#faf7f2] px-3 py-1 text-xs text-[#8a8175]">
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

                  {/* RIGHT CHAT */}
                  <aside className="overflow-hidden rounded-[34px] border border-[#e7dfd2] bg-[rgba(255,255,255,0.72)] shadow-[0_25px_70px_rgba(0,0,0,0.08)] backdrop-blur-2xl h-[70vh] min-h-[560px] max-h-[760px] lg:sticky lg:top-24">
                    {selectedInquiry ? (
                      <div className="flex h-full flex-col">
                        {/* HEADER */}
                        <div className="border-b border-[#ece5da] bg-[linear-gradient(180deg,#faf7f2_0%,#ffffff_100%)] px-5 py-4">
                          <h2 className="text-lg font-semibold text-[#2d2923]">
                            {selectedInquiry.name}
                          </h2>

                          <p className="text-sm text-[#8a8175]">
                            {selectedInquiry.property_title}
                          </p>
                        </div>

                        {/* CHAT */}
                        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
                          {messages.map((message) => {
                            const isMine =
                              Number(message.sender_id) === currentUserId;

                            return (
                              <div
                                key={message.message_id}
                                className={`flex ${isMine ? "justify-end" : "justify-start gap-2.5"}`}
                              >
                                {!isMine && (
                                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-[#e7dfd2] bg-[#faf7f2] text-[11px] font-semibold text-[#7b6d59]">
                                    {message.sender_name?.charAt(0) || "U"}
                                  </div>
                                )}

                                <div
                                  className={`max-w-[75%] flex flex-col ${isMine ? "items-end" : "items-start"}`}
                                >
                                  <div
                                    className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                                      isMine
                                        ? "bg-[#b8955f] text-white"
                                        : "border border-[#e7dfd2] bg-white text-[#2d2923]"
                                    }`}
                                  >
                                    {message.content}
                                  </div>

                                  <p className="mt-1 text-[10px] text-[#a89b8b]">
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

                          {typingLabel && (
                            <div className="flex justify-start gap-2.5">
                              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-[#e7dfd2] bg-[#faf7f2] text-[11px] font-semibold text-[#7b6d59]">
                                {(selectedInquiry.name || "U").charAt(0)}
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

                        {/* INPUT */}
                        <div className="border-t border-[#ece5da] bg-[#faf7f2] p-4">
                          <div className="flex gap-2">
                            <Input
                              value={messageText}
                              onChange={(e) =>
                                handleMessageTextChange(e.target.value)
                              }
                              placeholder="Write a message..."
                              className="rounded-2xl border-[#e7dfd2] bg-white"
                            />

                            <Button
                              onClick={handleSend}
                              className="rounded-2xl bg-[#b8955f] text-white hover:bg-[#a7844d]"
                            >
                              Send
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#8a8175]">
                        Select an inquiry
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

        <Dialog
          open={openEditModal}
          onOpenChange={(nextOpen) => {
            setOpenEditModal(nextOpen);
            if (!nextOpen) {
              setEditingProperty(null);
            }
          }}
        >
          <DialogContent className="fixed top-[50%] left-[50%] z-50 w-[95vw] max-w-6xl max-h-[90vh] translate-x-[-50%] translate-y-[-50%] bg-white">
             {editingProperty ? (
              <AddPropertyModal
                mode="update"
                initialProperty={editingProperty}
                onClose={() => {
                  setOpenEditModal(false);
                  setEditingProperty(null);
                }}
                onSave={() => {
                  setActiveTab("properties");
                  fetchOwnerProperties();
                }}
              />
            ) : null}
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={Boolean(propertyToDelete)}
          onOpenChange={(nextOpen) => {
            if (!nextOpen && !deletingProperty) {
              setPropertyToDelete(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete property?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove{" "}
                <span className="font-medium text-slate-800">
                  {propertyToDelete?.title || "this property"}
                </span>{" "}
                and associated records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deletingProperty}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(event) => {
                  event.preventDefault();
                  handleDeleteProperty();
                }}
                disabled={deletingProperty}
                className="bg-rose-600 hover:bg-rose-700"
              >
                {deletingProperty ? "Deleting..." : "Delete Property"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default OwnerDashboard;
