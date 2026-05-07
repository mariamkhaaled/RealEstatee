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
  X,
} from "lucide-react";
import { createInquiry } from "@/api/inquiries";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/context/FavoritesContext";

const gold =
  "linear-gradient(135deg,#c8a96e 0%,#e8d4a8 50%,#c8a96e 100%)";

const PropertyDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const propertyId = id || "";
  const isFav = isFavorite(propertyId);

  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/properties/${id}`);
        const data = await res.json();
        setListing(data.data.property);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createInquiry({
        listing_id: Number(listing.listing_id),
        name: requestForm.name,
        email: requestForm.email,
        phone: requestForm.phone,
        message: requestForm.message,
      });

      setSubmitMessage("Request sent successfully.");
    } catch {
      setSubmitMessage("Failed to send request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return <div className="p-10 text-[#7a6040]">Loading property...</div>;

  if (!listing)
    return <div className="p-10 text-[#7a6040]">Property not found.</div>;

  const images =
    listing.images?.length > 0
      ? listing.images.map((img: string) =>
        img.startsWith("http") ? img : `http://localhost:5000${img}`
      )
      : ["https://via.placeholder.com/1200x700"];

  return (
    <div className="min-h-screen bg-[#f3f0ea] font-sans">

      <div className="max-w-6xl mx-auto px-2 py-9 scale-[0.90] origin-top">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div>
            <Badge style={{ background: gold, color: "#2a1f0e" }}>
              For {listing.purpose}
            </Badge>

            <h1 className="text-4xl font-serif text-[#1a1814] mt-3">
              {listing.title}
            </h1>

            <div className="flex items-center text-[#7a6040] mt-2">
              <MapPin size={16} className="mr-1" />
              {listing.city}
            </div>
          </div>

          <p className="text-3xl font-bold text-[#c8a96e] mt-6 md:mt-10">
  ${Number(listing.price).toLocaleString()}
</p>
        </div>

        {/* IMAGE GRID */}
        {/* IMAGE GRID (click opens gallery) */}
        {/* IMAGE GRID */}
        <div className="grid grid-cols-4 gap-4 h-[500px] rounded-2xl overflow-hidden mb-10">

          {/* MAIN IMAGE */}
          <div className="col-span-3">
            <img
              src={images[0]}
              onClick={() => {
                setSelectedImage(0);
                setShowGallery(true);
              }}
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>

          {/* RIGHT SIDE (always show up to 3 images safely) */}
          <div className="flex flex-col gap-4 h-full">

            {/* image 1 */}
            {images[1] && (
              <img
                src={images[1]}
                onClick={() => {
                  setSelectedImage(1);
                  setShowGallery(true);
                }}
                className={`w-full object-cover cursor-pointer ${images.length === 2 ? "h-full" : "h-1/2"
                  }`}
              />
            )}

            {/* image 2 / 3rd visible slot */}
            {images[2] && (
              <div
                className="relative w-full h-1/2 cursor-pointer"
                onClick={() => {
                  setSelectedImage(2);
                  setShowGallery(true);
                }}
              >
                <img
                  src={images[2]}
                  className="w-full h-full object-cover"
                />

                {/* +N overlay */}
                {images.length > 3 && (
                  <div className="absolute inset-0 bg-black/30 flex items-start justify-center pt-16">
                    <span className="text-white text-2xl font-semibold">
                      +{images.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* INFO */}
        <div className="grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-8">

            <div className="flex justify-around p-6 rounded-xl border border-[#e3dccf] bg-[#faf9f7]">
              <div className="text-center">
                <Bed className="mx-auto text-[#c8a96e]" />
                <p>{listing.bedrooms} Beds</p>
              </div>
              <div className="text-center">
                <Bath className="mx-auto text-[#c8a96e]" />
                <p>{listing.bathrooms} Baths</p>
              </div>
              <div className="text-center">
                <Square className="mx-auto text-[#c8a96e]" />
                <p>{listing.area} sqft</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-serif text-[#1a1814] mb-2">
                Description
              </h2>
              <p className="text-[#7a6040]">{listing.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-[#1a1814] mb-3">
                Features
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {listing.features?.map((f: string) => (
                  <div key={f} className="flex items-center text-[#7a6040]">
                    <Check size={14} className="text-[#c8a96e] mr-2" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FORM */}
          <Card className="bg-[#faf9f7] border border-[#e3dccf]">
            <CardContent className="p-6 space-y-4">

              <h3 className="font-serif text-xl text-[#1a1814]">
                Request Property
              </h3>

              <Input placeholder="Name"
                onChange={(e) =>
                  setRequestForm({ ...requestForm, name: e.target.value })
                } />

              <Input placeholder="Email"
                onChange={(e) =>
                  setRequestForm({ ...requestForm, email: e.target.value })
                } />

              <Input placeholder="Phone"
                onChange={(e) =>
                  setRequestForm({ ...requestForm, phone: e.target.value })
                } />

              <textarea
                className="w-full border p-2 rounded-md"
                placeholder="Message"
                onChange={(e) =>
                  setRequestForm({ ...requestForm, message: e.target.value })
                }
              />

              <button
                onClick={handleRequestSubmit}
                className="w-full py-3 text-[#2a1f0e] font-bold"
                style={{ background: gold }}
              >
                Send Request
              </button>

              {submitMessage && (
                <p className="text-sm text-[#7a6040]">{submitMessage}</p>
              )}

              <button className="w-full border border-[#c8a96e] py-2 text-[#7a6040]">
                <Heart className="inline mr-2" /> Save
              </button>

            </CardContent>
          </Card>

        </div>
      </div>

      {/* GALLERY */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "rgba(243,240,234,0.98)" }}>

          <div className="flex justify-between p-4 text-[#1a1814]">
            <span>
              {selectedImage + 1} / {images.length}
            </span>

            <button onClick={() => setShowGallery(false)}>
              <X />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <img
              src={images[selectedImage]}
              className="max-h-[80vh] object-contain"
            />
          </div>

          <div className="flex gap-2 justify-center p-4 overflow-x-auto">
            {images.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-16 object-cover cursor-pointer border ${selectedImage === i
                    ? "border-[#c8a96e]"
                    : "border-transparent"
                  }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;