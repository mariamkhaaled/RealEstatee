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
    <footer className="mt-24 border-t border-white/10 bg-[#0f0f11] text-[#f5f1eb]">
      
      {/* Newsletter */}
      <div className="border-b border-white/10 bg-gradient-to-r from-[#151517] to-[#1b1b1f]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center">
            
            <p className="uppercase tracking-[0.35em] text-[11px] text-[#c6a77d] mb-4 font-medium">
              Exclusive Updates
            </p>

            <h3 className="text-4xl md:text-5xl font-light leading-tight tracking-tight text-white">
              Discover New Luxury Listings
            </h3>

            <p className="mt-5 text-[#b7b1a8] leading-relaxed text-sm md:text-base max-w-xl mx-auto">
              Subscribe to receive curated premium properties, market insights,
              and exclusive investment opportunities.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="
                  h-14
                  bg-[#18181b]
                  border border-white/10
                  text-white
                  placeholder:text-[#8f8b84]
                  rounded-none
                  focus-visible:ring-0
                  focus-visible:border-[#c6a77d]
                "
              />

              <Button
                className="
                  h-14
                  px-8
                  rounded-none
                  bg-[#c6a77d]
                  hover:bg-[#d4b48a]
                  text-black
                  font-medium
                  tracking-wide
                  transition-all
                  duration-300
                "
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

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 border border-[#c6a77d]/40 bg-[#18181b] flex items-center justify-center">
                <HomeIcon size={24} className="text-[#c6a77d]" />
              </div>

              <div>
                <h2 className="text-2xl font-light tracking-[0.18em] text-white">
                  LUXEESTATES
                </h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#8f8b84] mt-1">
                  Luxury Real Estate
                </p>
              </div>
            </Link>

            <p className="text-[#b7b1a8] leading-loose max-w-md text-sm">
              We redefine luxury living by connecting discerning buyers with
              exceptional properties in the world’s most sought-after locations.
            </p>

            <div className="flex gap-3 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  title={social.label}
                  className="
                    w-11 h-11
                    border border-white/10
                    bg-[#18181b]
                    flex items-center justify-center
                    text-[#c6a77d]
                    hover:bg-[#c6a77d]
                    hover:text-black
                    transition-all duration-300
                  "
                >
                  <social.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm tracking-[0.25em] uppercase text-white mb-6">
              Company
            </h4>

            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="
                      text-sm text-[#b7b1a8]
                      hover:text-[#c6a77d]
                      transition-colors
                    "
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h4 className="text-sm tracking-[0.25em] uppercase text-white mb-6">
              Properties
            </h4>

            <ul className="space-y-4">
              {footerLinks.properties.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="
                      text-sm text-[#b7b1a8]
                      hover:text-[#c6a77d]
                      transition-colors
                    "
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm tracking-[0.25em] uppercase text-white mb-6">
              Contact
            </h4>

            <ul className="space-y-5">
              <li className="flex gap-3">
                <Mail
                  size={17}
                  className="text-[#c6a77d] flex-shrink-0 mt-0.5"
                />
                <a
                  href="mailto:support@luxeestates.com"
                  className="text-sm text-[#b7b1a8] hover:text-[#c6a77d] transition-colors"
                >
                  support@luxeestates.com
                </a>
              </li>

              <li className="flex gap-3">
                <Phone
                  size={17}
                  className="text-[#c6a77d] flex-shrink-0 mt-0.5"
                />
                <a
                  href="tel:+1234567890"
                  className="text-sm text-[#b7b1a8] hover:text-[#c6a77d] transition-colors"
                >
                  +1 (234) 567-8900
                </a>
              </li>

              <li className="flex gap-3">
                <MapPin
                  size={17}
                  className="text-[#c6a77d] flex-shrink-0 mt-0.5"
                />
                <span className="text-sm text-[#b7b1a8] leading-relaxed">
                  123 Luxury Avenue,
                  <br />
                  New York, NY 10001
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/10 my-12" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          <p className="text-xs tracking-[0.18em] uppercase text-[#7d7972]">
            © {currentYear} LuxeEstates — All Rights Reserved
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            <a
              href="#"
              className="text-xs tracking-[0.15em] uppercase text-[#9f9a92] hover:text-[#c6a77d] transition-colors"
            >
              Terms
            </a>

            <a
              href="#"
              className="text-xs tracking-[0.15em] uppercase text-[#9f9a92] hover:text-[#c6a77d] transition-colors"
            >
              Privacy
            </a>

            <a
              href="#"
              className="text-xs tracking-[0.15em] uppercase text-[#9f9a92] hover:text-[#c6a77d] transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;