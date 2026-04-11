import React, { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PropertyDetails: React.FC = () => {
  const listing = {
    id: 1,
    title: 'Modern Seaside Villa',
    purpose: 'Sale',
    type: 'Villa',
    price: 1250000,
    pricePerSqft: 390,
    address: '123 Ocean Drive, Miami, FL 33139',
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    status: 'Active', // Active | Pending | Sold | Rented | Closed
    description:
      'Experience unparalleled coastal living in this modern seaside villa. Boasting panoramic ocean views, an open-concept living space, and state-of-the-art amenities, this property is the epitome of luxury. The master suite features a private balcony overlooking the water, while the expansive backyard offers a pristine infinity pool and outdoor kitchen, perfect for entertaining.',
    features: [
      'Swimming Pool',
      'Smart Home System',
      'Double Garage',
      'Central AC',
      'Security Cameras',
      'Ocean View',
      'Outdoor Kitchen',
      'Hardwood Floors',
    ],
    owner: {
      name: 'Robert Fox',
      role: 'Property Owner',
      phone: '+1 (555) 123-4567',
      email: 'robert@example.com',
      avatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80',
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80',
    ],
    closedTo: '',
  };

  const isListingClosed =
    listing.status === 'Sold' ||
    listing.status === 'Rented' ||
    listing.status === 'Closed';

  const [requestForm, setRequestForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage('');

    if (
      !requestForm.name.trim() ||
      !requestForm.email.trim() ||
      !requestForm.phone.trim() ||
      !requestForm.message.trim()
    ) {
      setSubmitMessage('Please fill all fields before sending your request.');
      return;
    }

    if (isListingClosed) {
      setSubmitMessage('This listing is no longer accepting requests.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      listingId: listing.id,
      name: requestForm.name,
      email: requestForm.email,
      phone: requestForm.phone,
      message: requestForm.message,
      status: 'Pending',
    };

    try {
      console.log('Request payload:', payload);

      // بعدين بدلي ده بالـ API الحقيقي
      // await fetch('http://localhost:5000/listing-requests', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });

      setSubmitMessage('Your request has been sent successfully.');
      setRequestForm({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      console.error(error);
      setSubmitMessage('Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Sold':
      case 'Rented':
      case 'Closed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-secondary text-secondary-foreground';
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
              {listing.type}
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
            <span>{listing.address}</span>
          </div>
        </div>

        <div className="text-left md:text-right">
          <p className="text-3xl font-bold text-primary">
            ${listing.price.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            ${listing.pricePerSqft} / sqft
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[500px] rounded-2xl overflow-hidden">
        <div className="md:col-span-3 h-full">
          <img
            src={listing.images[0]}
            alt="Main"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="hidden md:flex flex-col gap-4 h-full">
          <img
            src={listing.images[1]}
            alt="Sub 1"
            className="w-full h-1/2 object-cover"
          />

          <div className="relative w-full h-1/2">
            <img
              src={listing.images[2]}
              alt="Sub 2"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
              <span className="text-white font-medium">+12 Photos</span>
            </div>
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
              {listing.features.map((feature) => (
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
            <Button variant="outline" className="flex-1">
              <Heart className="mr-2" size={18} /> Save
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
              <p className="text-sm text-muted-foreground mb-4">
                Send your request directly to the owner about this listing.
              </p>

              {isListingClosed && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  This listing is currently {listing.status.toLowerCase()} and is
                  no longer accepting requests.
                  {listing.closedTo && ` Closed with ${listing.closedTo}.`}
                </div>
              )}

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

                {submitMessage && (
                  <p
                    className={`text-sm ${
                      submitMessage.toLowerCase().includes('success')
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}
                  >
                    {submitMessage}
                  </p>
                )}

                <Button
                  className="w-full"
                  disabled={isListingClosed || isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-full overflow-hidden mr-4">
                    <img
                      src={listing.owner.avatar}
                      alt="Owner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {listing.owner.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {listing.owner.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    <Phone className="mr-2" size={16} /> {listing.owner.phone}
                  </Button>

                  <Button
                    variant="secondary"
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    <Mail className="mr-2" size={16} /> {listing.owner.email}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;