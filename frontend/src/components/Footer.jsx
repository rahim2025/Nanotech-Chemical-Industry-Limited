import { Link } from "react-router-dom";
import { MapPin, Mail, Globe, Heart, Building2, Phone, Printer, ArrowUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const offices = [
  {
    name: "Guangzhou Office",
    address: "RM. 502, No.-2 Building, Shanxi Tower, No.-5 Yaoquan Street, Yuexiu District, Guangzhou City, China"
  },
  {
    name: "Hong Kong Office",
    address: "Room-1503-09, 15/F, Causeway Bay Centre, 15-23 Sugar Street, Causeway Bay, Hong Kong"
  }
];

const whatsappNumbers = [
  { label: "Hongkong", value: "+852 6141-5689", href: "https://wa.me/85261415689" },
  { label: "China", value: "+86 132 5051 7650", href: "https://wa.me/8613250517650" }
];

const quickLinks = [
  { label: "Products", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Careers", to: "/careers" },
  { label: "Contact Us", to: "/contact" }
];

const IconBadge = ({ children }) => (
  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
    {children}
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-base-200 border-t border-base-300">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-white border border-primary/30 flex items-center justify-center">
                <img src="/logo.png" alt="Nanotech Chemical Logo" className="w-9 h-9 object-contain" />
              </div>
              <h3 className="font-bold text-lg">Nanotech Chemical</h3>
            </div>
            <p className="text-sm text-base-content/70 mb-5 leading-relaxed">
              Quality chemical products with competitive pricing and reliable delivery services worldwide.
            </p>
            <div className="flex flex-col gap-2">
              {whatsappNumbers.map((wa) => (
                <a
                  key={wa.href}
                  href={wa.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium bg-[#25D366]/10 text-[#128C4A] hover:bg-[#25D366]/20 rounded-full px-3 py-1.5 transition-colors w-fit"
                >
                  <FaWhatsapp size={16} />
                  {wa.value} <span className="text-base-content/50 font-normal">({wa.label})</span>
                </a>
              ))}
            </div>
          </div>

          {/* Our Offices */}
          <div>
            <h3 className="font-bold text-lg mb-4">Our Offices</h3>
            <div className="flex flex-col gap-4">
              {offices.map((office) => (
                <div key={office.name} className="flex items-start gap-3">
                  <IconBadge><Building2 size={16} /></IconBadge>
                  <div>
                    <p className="text-sm font-semibold">{office.name}</p>
                    <p className="text-xs text-base-content/60 leading-relaxed mt-0.5">{office.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <IconBadge><Mail size={16} /></IconBadge>
                <a href="mailto:nanotechcil@gmail.com" className="text-sm hover:text-primary transition-colors break-all">
                  nanotechcil@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <IconBadge><Phone size={16} /></IconBadge>
                <a href="tel:+862029041125" className="text-sm hover:text-primary transition-colors">
                  Tel: 020-2904 1125
                </a>
              </div>
              <div className="flex items-center gap-3">
                <IconBadge><Printer size={16} /></IconBadge>
                <span className="text-sm text-base-content/70">Fax: 020-2825 0127</span>
              </div>
              <div className="flex items-center gap-3">
                <IconBadge><MapPin size={16} /></IconBadge>
                <span className="text-sm text-base-content/70">Guangzhou City, China & Hong Kong</span>
              </div>
            </div>
          </div>

          {/* Quick Links + Hours */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 mb-6">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-base-content/80 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-lg mb-3">Business Hours</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Monday - Friday</span>
                <span className="font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Saturday</span>
                <span className="font-medium">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Sunday</span>
                <span className="font-medium">Closed</span>
              </div>
              <a
                href="http://www.nanotechchemical.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 pt-3 mt-3 border-t border-base-300 hover:text-primary transition-colors"
              >
                <Globe size={16} />
                www.nanotechchemical.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-base-300/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-base-content/70">
          <p className="text-center sm:text-left">
            © {currentYear} Nanotech Chemical Industry Limited. All Rights Reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-base-content/60">
            Quality, cost and fast delivery are our top priorities
            <Heart size={12} className="text-primary fill-primary" />
          </p>
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-content transition-colors"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
