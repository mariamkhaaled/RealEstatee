import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Check,
  Heart,
  Share2,
  Phone,
  Mail,
} from "lucide-react";
import { createInquiry } from "@/api/inquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/context/FavoritesContext";

type ListingType = {
  property_id: number;
  listing_id: number;
  title: string;
  description: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  purpose: string;
  price: number;
  status: string;
  views: number;
  city: string;
  address: string;
  images?: string[];
  features?: string[];
};

const PropertyDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingFavorite, setSavingFavorite] = useState(false);

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const propertyId = id || "";
  const isFav = isFavorite(propertyId);

  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setSavingFavorite(true);

      if (isFav) {
        await fetch(`http://localhost:5000/api/favorites/${propertyId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        removeFavorite(propertyId);
      } else {
        await fetch("http://localhost:5000/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            property_id: propertyId,
          }),
        });
        addFavorite(propertyId);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSavingFavorite(false);
    }
  };

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return;

    try {
      const user = JSON.parse(rawUser);
      const firstName = user?.firstName || "";
      const lastName = user?.lastName || "";
      const fullNameFromParts = `${firstName} ${lastName}`.trim();
      const fullName =
        fullNameFromParts ||
        user?.full_name ||
        user?.name ||
        user?.username ||
        "";
      const email = user?.email || "";

      setRequestForm((prev) => ({
        ...prev,
        name: prev.name || fullName,
        email: prev.email || email,
      }));
    } catch {
      // Ignore invalid localStorage user JSON
    }
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        console.log("params id =", id);

        const res = await fetch(`http://localhost:5000/api/properties/${id}`);
        const data = await res.json();

        console.log("api response =", data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to load property");
        }

        setListing(data.data.property);
      } catch (error) {
        console.error("fetchProperty error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">Loading property...</div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">Property not found.</div>
    );
  }

  const safeImages =
    listing.images && listing.images.length > 0
      ? listing.images.map((img) =>
          img.startsWith("http") ? img : `http://localhost:5000${img}`,
        )
      : ["https://via.placeholder.com/1200x700?text=No+Image"];

  const safeFeatures = listing.features || [];

  const isListingClosed =
    listing.status === "Sold" ||
    listing.status === "Rented" ||
    listing.status === "Closed";

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage("");

    if (
      !requestForm.name.trim() ||
      !requestForm.email.trim() ||
      !requestForm.phone.trim() ||
      !requestForm.message.trim()
    ) {
      setSubmitMessage("Please fill all fields before sending your request.");
      return;
    }

    if (isListingClosed) {
      setSubmitMessage("This listing is no longer accepting requests.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!listing.listing_id) {
        setSubmitMessage("Unable to send request for this property right now.");
        return;
      }

      const response = await createInquiry({
        listing_id: Number(listing.listing_id),
        name: requestForm.name.trim(),
        email: requestForm.email.trim().toLowerCase(),
        phone: requestForm.phone.trim(),
        message: requestForm.message.trim(),
      });

      if (response?.data && "reused" in response.data && response.data.reused) {
        setSubmitMessage("You already sent a request for this listing.");
        return;
      }

      setSubmitMessage("Your request has been sent successfully.");
      setRequestForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error: any) {
      const message = error?.message || "";
      if (message.toLowerCase().includes("authentication required")) {
        setSubmitMessage(
          "Please login first to send a request. Redirecting to login...",
        );
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setSubmitMessage(
          message || "Failed to send request. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-700 border-green-200";
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Sold":
      case "Rented":
      case "Closed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <div className="flex gap-2 mb-2 flex-wrap">
            <Badge className="bg-primary text-primary-foreground">
              For {listing.purpose}
            </Badge>

            <Badge variant="outline" className="text-foreground">
              {listing.property_type}
            </Badge>

            <Badge
              variant="outline"
              className={getStatusBadgeClass(listing.status)}
            >
              {listing.status}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {listing.title}
          </h1>

          <div className="flex items-center text-muted-foreground">
            <MapPin size={18} className="mr-1" />
            <span>
              {listing.city}
              {listing.address ? `, ${listing.address}` : ""}
            </span>
          </div>
        </div>

        <div className="text-left md:text-right">
          <p className="text-3xl font-bold text-primary">
            ${Number(listing.price).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[500px] rounded-2xl overflow-hidden">
        <div className="md:col-span-3 h-full">
          <img
            src={safeImages[0]}
            alt="Main"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="hidden md:flex flex-col gap-4 h-full">
          <img
            src={safeImages[1] || safeImages[0]}
            alt="Sub 1"
            className="w-full h-1/2 object-cover"
          />
          <div className="relative w-full h-1/2">
            <img
              src={safeImages[2] || safeImages[0]}
              alt="Sub 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex bg-card border border-border rounded-xl p-6 shadow-custom justify-around">
            <div className="flex flex-col items-center">
              <Bed size={28} className="text-primary mb-2" />
              <span className="font-semibold text-foreground">
                {listing.bedrooms} Bedrooms
              </span>
            </div>

            <div className="w-px bg-border"></div>

            <div className="flex flex-col items-center">
              <Bath size={28} className="text-primary mb-2" />
              <span className="font-semibold text-foreground">
                {listing.bathrooms} Bathrooms
              </span>
            </div>

            <div className="w-px bg-border"></div>

            <div className="flex flex-col items-center">
              <Square size={28} className="text-primary mb-2" />
              <span className="font-semibold text-foreground">
                {listing.area.toLocaleString()} sqft
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Description
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {listing.description}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Features & Amenities
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {safeFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center text-muted-foreground"
                >
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center mr-3 flex-shrink-0">
                    <Check size={12} className="text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <Button
              variant={isFav ? "default" : "outline"}
              className="flex-1"
              onClick={handleToggleFavorite}
              disabled={savingFavorite}
            >
              <Heart
                className={`mr-2 ${isFav ? "fill-current" : ""}`}
                size={18}
              />
              {isFav ? "Saved" : "Save"}
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2" size={18} /> Share
            </Button>
          </div>

          <Card className="shadow-custom border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-2">
                Request This Property
              </h3>

              <form className="space-y-4" onSubmit={handleRequestSubmit}>
                <Input
                  name="name"
                  placeholder="Your Name"
                  value={requestForm.name}
                  onChange={handleChange}
                  disabled={isListingClosed || isSubmitting}
                />
                <Input
                  name="email"
                  placeholder="Email Address"
                  type="email"
                  value={requestForm.email}
                  onChange={handleChange}
                  disabled={isListingClosed || isSubmitting}
                />
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  type="tel"
                  value={requestForm.phone}
                  onChange={handleChange}
                  disabled={isListingClosed || isSubmitting}
                />
                <textarea
                  name="message"
                  rows={4}
                  value={requestForm.message}
                  onChange={handleChange}
                  disabled={isListingClosed || isSubmitting}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-60"
                  placeholder="Write your request message..."
                ></textarea>

                {submitMessage && <p className="text-sm">{submitMessage}</p>}

                <Button
                  className="w-full"
                  disabled={isListingClosed || isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Request"}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border space-y-2">
                <Button
                  variant="secondary"
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  <Phone className="mr-2" size={16} /> Contact Owner
                </Button>

                <Button
                  variant="secondary"
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  <Mail className="mr-2" size={16} /> Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
