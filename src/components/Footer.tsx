import React from 'react';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer data-cmp="Footer" className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg inline-block">
                <Home className="text-primary-foreground" size={20} />
              </div>
              <span className="text-xl font-bold text-primary">EstateAura</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Find your dream property with the most trusted real estate platform. We make buying, selling, and renting easy.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Home</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Properties</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Agents</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Apartments for Rent</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Luxury Villas</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Commercial Offices</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Houses for Sale</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="text-primary mt-0.5" size={16} />
                <span className="text-muted-foreground text-sm">123 Real Estate Blvd, Suite 100, New York, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-primary" size={16} />
                <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-primary" size={16} />
                <span className="text-muted-foreground text-sm">contact@estateaura.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EstateAura. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;