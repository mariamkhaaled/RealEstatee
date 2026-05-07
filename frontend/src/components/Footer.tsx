import React from 'react';
import {
  Home as HomeIcon,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Shiny Gold Gradient Constant
  const shinyGoldGradient = "bg-gradient-to-tr from-[#c5a367] via-[#f3d39a] to-[#b88a44]";

  const footerLinks = {
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
    ],
    properties: [
      { label: 'For Sale', href: '/properties' },
      { label: 'For Rent', href: '/properties' },
      { label: 'Installments', href: '/properties' },
      { label: 'Featured', href: '#' },
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="mt-24 border-t border-white/5 bg-[#0a0a0b] text-[#f5f1eb]">
      
      {/* Newsletter - High-Contrast Dark Luxury */}
      <div className="border-b border-white/5 bg-[#0f0f11]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center">
            
            <p className="uppercase tracking-[0.4em] text-[10px] text-[#d4af37] mb-4 font-semibold">
              Exclusive Access
            </p>

            <h3 className="text-4xl md:text-5xl font-serif font-light leading-tight tracking-tight text-white">
              Discover New Luxury Listings
            </h3>

            <p className="mt-5 text-[#8f8b84] leading-relaxed text-sm md:text-base max-w-xl mx-auto">
              Subscribe to receive curated premium properties and exclusive investment opportunities.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="
                  h-14
                  bg-[#161618]
                  border-white/10
                  text-white
                  placeholder:text-[#5a5650]
                  rounded-xl
                  focus-visible:ring-1
                  focus-visible:ring-[#d4af37]/50
                  focus-visible:border-[#d4af37]
                "
              />

              <Button
                className={`
                  h-14
                  px-8
                  rounded-xl
                  ${shinyGoldGradient}
                  hover:brightness-110
                  text-[#1a1814]
                  font-bold
                  tracking-wider
                  uppercase
                  text-[11px]
                  shadow-[0_0_20px_rgba(197,163,103,0.2)]
                  transition-all
                  duration-300
                `}
              >
                Subscribe
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-14">

          {/* Brand Area */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-4 mb-8 group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${shinyGoldGradient} shadow-lg shadow-black`}>
                <HomeIcon size={24} className="text-[#1a1814]" />
              </div>

              <div>
                <h2 className="text-2xl font-serif tracking-[0.1em] text-white">
                  LUXEESTATES
                </h2>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37] mt-1 font-medium">
                  Premium Realty
                </p>
              </div>
            </Link>

            <p className="text-[#8f8b84] leading-loose max-w-md text-sm font-light">
              We redefine high-end living by connecting discerning buyers with
              exceptional properties across the globe.
            </p>

            <div className="flex gap-4 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="
                    w-10 h-10
                    rounded-full
                    border border-white/10
                    bg-[#161618]
                    flex items-center justify-center
                    text-[#8f8b84]
                    hover:text-[#d4af37]
                    hover:border-[#d4af37]/50
                    transition-all duration-300
                  "
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          {['company', 'properties'].map((section) => (
            <div key={section}>
              <h4 className="text-[11px] tracking-[0.25em] uppercase text-white font-bold mb-8">
                {section}
              </h4>
              <ul className="space-y-4">
                {(footerLinks as any)[section].map((link: any) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-[#8f8b84] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Details */}
          <div>
            <h4 className="text-[11px] tracking-[0.25em] uppercase text-white font-bold mb-8">
              Inquiries
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-[#d4af37] mt-1" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-[#5a5650] tracking-tighter">Email Us</span>
                  <a href="mailto:info@luxeestates.com" className="text-sm text-[#8f8b84] hover:text-white transition-colors">
                    info@luxeestates.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#d4af37] mt-1" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-[#5a5650] tracking-tighter">Visit</span>
                  <span className="text-sm text-[#8f8b84]">123 Luxury Ave, NY</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/5 my-12" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#5a5650]">
            © {currentYear} LuxeEstates — Crafted for Excellence
          </p>
          <div className="flex gap-8">
            {['Privacy', 'Legal', 'Sitemap'].map((item) => (
              <a key={item} href="#" className="text-[10px] tracking-[0.15em] uppercase text-[#5a5650] hover:text-[#d4af37] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
