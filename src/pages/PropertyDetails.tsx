import React from 'react';
import { MapPin, Bed, Bath, Square, Check, Heart, Share2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PropertyDetails: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <div className="flex gap-2 mb-2">
            <Badge className="bg-primary text-primary-foreground">For Sale</Badge>
            <Badge variant="outline" className="text-foreground">Villa</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Modern Seaside Villa</h1>
          <div className="flex items-center text-muted-foreground">
            <MapPin size={18} className="mr-1" />
            <span>123 Ocean Drive, Miami, FL 33139</span>
          </div>
        </div>
        <div className="text-left md:text-right">
          <p className="text-3xl font-bold text-primary">$1,250,000</p>
          <p className="text-sm text-muted-foreground">$390 / sqft</p>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[500px] rounded-2xl overflow-hidden">
        <div className="md:col-span-3 h-full">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" 
            alt="Main" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden md:flex flex-col gap-4 h-full">
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80" 
            alt="Sub 1" 
            className="w-full h-1/2 object-cover"
          />
          <div className="relative w-full h-1/2">
            <img 
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80" 
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
        {/* Main Description & Features */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex bg-card border border-border rounded-xl p-6 shadow-custom justify-around">
            <div className="flex flex-col items-center">
              <Bed size={28} className="text-primary mb-2" />
              <span className="font-semibold text-foreground">4 Bedrooms</span>
            </div>
            <div className="w-px bg-border"></div>
            <div className="flex flex-col items-center">
              <Bath size={28} className="text-primary mb-2" />
              <span className="font-semibold text-foreground">3 Bathrooms</span>
            </div>
            <div className="w-px bg-border"></div>
            <div className="flex flex-col items-center">
              <Square size={28} className="text-primary mb-2" />
              <span className="font-semibold text-foreground">3,200 sqft</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              Experience unparalleled coastal living in this modern seaside villa. Boasting panoramic ocean views, an open-concept living space, and state-of-the-art amenities, this property is the epitome of luxury. The master suite features a private balcony overlooking the water, while the expansive backyard offers a pristine infinity pool and outdoor kitchen, perfect for entertaining.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Features & Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['Swimming Pool', 'Smart Home System', 'Double Garage', 'Central AC', 'Security Cameras', 'Ocean View', 'Outdoor Kitchen', 'Hardwood Floors'].map(feature => (
                <div key={feature} className="flex items-center text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center mr-3 flex-shrink-0">
                    <Check size={12} className="text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Actions & Contact Form */}
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
              <h3 className="text-lg font-bold text-foreground mb-4">Contact Owner</h3>
              <form className="space-y-4">
                <Input placeholder="Your Name" />
                <Input placeholder="Email Address" type="email" />
                <Input placeholder="Phone Number" type="tel" />
                <textarea 
                  rows={4} 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="I'm interested in this property..."
                ></textarea>
                <Button className="w-full">Send Inquiry</Button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-full overflow-hidden mr-4">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80" alt="Owner" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Robert Fox</p>
                    <p className="text-sm text-muted-foreground">Property Owner</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="secondary" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <Phone className="mr-2" size={16} /> +1 (555) 123-4567
                  </Button>
                  <Button variant="secondary" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <Mail className="mr-2" size={16} /> robert@example.com
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