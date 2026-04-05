import React from 'react';
import { MapPin, Bed, Bath, Square, Heart, Share2, Calendar, ShieldCheck, Mail, Phone } from 'lucide-react';

const PropertyDetails: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Title & Header Section */}
      <div className="bg-card border-b border-border pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">For Sale</span>
                <span className="bg-secondary text-foreground text-xs font-bold px-3 py-1 rounded-full border border-border">Villa</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">Spacious Family Villa</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin size={18} className="mr-1" />
                <span>Beverly Hills, California, 90210</span>
              </div>
            </div>
            <div className="text-left md:text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">$1,250,000</h2>
              <div className="flex space-x-2">
                <button className="flex items-center space-x-1 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors border border-border font-medium">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-1 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors border border-border font-medium">
                  <Heart size={18} className="text-destructive" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content (Left) */}
          <div className="flex-1 space-y-8">
            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] md:h-[500px]">
              <div className="md:col-span-2 h-2/3 md:h-full rounded-2xl overflow-hidden shadow-custom">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" 
                  alt="Main Property" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Note: In a real app, these would be visible on larger screens. simplified for UI mockup */}
            </div>

            {/* Quick Stats */}
            <div className="bg-card p-6 rounded-2xl shadow-custom border border-border flex flex-wrap gap-6 justify-between items-center">
              <div className="flex flex-col items-center flex-1 min-w-[80px]">
                <Bed size={28} className="text-primary mb-2" />
                <span className="font-bold text-foreground text-lg">5</span>
                <span className="text-muted-foreground text-sm">Bedrooms</span>
              </div>
              <div className="w-px h-12 bg-border hidden md:block"></div>
              <div className="flex flex-col items-center flex-1 min-w-[80px]">
                <Bath size={28} className="text-primary mb-2" />
                <span className="font-bold text-foreground text-lg">4</span>
                <span className="text-muted-foreground text-sm">Bathrooms</span>
              </div>
              <div className="w-px h-12 bg-border hidden md:block"></div>
              <div className="flex flex-col items-center flex-1 min-w-[80px]">
                <Square size={28} className="text-primary mb-2" />
                <span className="font-bold text-foreground text-lg">3500</span>
                <span className="text-muted-foreground text-sm">Square Feet</span>
              </div>
              <div className="w-px h-12 bg-border hidden md:block"></div>
              <div className="flex flex-col items-center flex-1 min-w-[80px]">
                <Calendar size={28} className="text-primary mb-2" />
                <span className="font-bold text-foreground text-lg">2021</span>
                <span className="text-muted-foreground text-sm">Year Built</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card p-6 md:p-8 rounded-2xl shadow-custom border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-4">Property Description</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Experience the epitome of luxury living in this stunning Beverly Hills villa. Built in 2021, this modern masterpiece features an open-concept floor plan, soaring ceilings, and floor-to-ceiling windows that flood the space with natural light.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The gourmet chef's kitchen is equipped with top-of-the-line stainless steel appliances, custom cabinetry, and a massive center island perfect for entertaining. The expansive master suite offers a private balcony, dual walk-in closets, and a spa-like en-suite bathroom with a soaking tub and glass-enclosed shower.
              </p>
            </div>

            {/* Features */}
            <div className="bg-card p-6 md:p-8 rounded-2xl shadow-custom border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-6">Features & Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                {['Air Conditioning', 'Swimming Pool', 'Central Heating', 'Laundry Room', 'Gym', 'Alarm System', 'Window Coverings', 'Internet', 'Car Parking'].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-2 text-foreground font-medium">
                    <ShieldCheck size={18} className="text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-card rounded-2xl shadow-custom border border-border p-6 sticky top-24">
              <h3 className="text-xl font-bold text-foreground mb-6">Contact Owner</h3>
              
              <div className="flex items-center space-x-4 mb-6 p-4 bg-secondary/50 rounded-xl border border-border">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80" 
                  alt="Owner" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                />
                <div>
                  <p className="font-bold text-foreground text-lg">Michael Scott</p>
                  <p className="text-muted-foreground text-sm">Property Owner</p>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <input type="text" placeholder="Your Name" className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <input type="email" placeholder="Email Address" className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <input type="tel" placeholder="Phone Number" className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <textarea rows={4} placeholder="I'm interested in this property..." className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"></textarea>
                </div>
                <button type="button" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-custom">
                  Send Message
                </button>
              </form>

              <div className="mt-6 space-y-3 pt-6 border-t border-border">
                <button className="w-full flex items-center justify-center space-x-2 border border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary hover:text-white transition-colors">
                  <Phone size={18} />
                  <span>Show Phone Number</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 border border-border text-foreground font-bold py-3 rounded-lg hover:bg-secondary transition-colors">
                  <Mail size={18} />
                  <span>Send Email Direct</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;