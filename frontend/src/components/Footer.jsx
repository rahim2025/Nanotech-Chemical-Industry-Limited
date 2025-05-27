import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Globe, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-primary/30 flex items-center justify-center">
                <img src="/logo.png" alt="Nanotech Chemical Logo" className="w-8 h-8 object-contain" />
              </div>
              <h3 className="font-bold text-lg">Nanotech Chemical</h3>
            </div>
            <p className="text-sm text-base-content/70 mb-4">
              Quality chemical products with competitive pricing and reliable delivery services worldwide.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="shrink-0 mt-1 text-primary" />
                <span className="text-sm">Guangzhou City, China & Hong Kong</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-primary" />
                <span className="text-sm">+8613250517650</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-primary" />
                <a href="mailto:purchase@nanotechchemical.com" className="text-sm hover:text-primary">
                  purchase@nanotechchemical.com
                </a>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-base-content/80 hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/home" className="text-base-content/80 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-base-content/80 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              {/* Additional links depending on authentication */}
            </ul>
          </div>
          
          {/* Business Hours */}
          <div>
            <h3 className="font-bold text-lg mb-4">Business Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Monday - Friday:</span>
                <span className="font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Saturday:</span>
                <span className="font-medium">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Sunday:</span>
                <span className="font-medium">Closed</span>
              </div>
              <div className="pt-2 mt-2 border-t border-base-300">
                <a 
                  href="http://www.nanotechchemical.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <Globe size={16} />
                  Visit our website
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-4 border-t border-base-300/60 text-center text-sm text-base-content/70">
          <p className="flex items-center justify-center gap-1">
            © {currentYear} Nanotech Chemical Industry Limited. All Rights Reserved.
          </p>
          <p className="mt-2 text-xs flex items-center justify-center gap-1">
            Made with <Heart size={12} className="text-error" fill="currentColor" /> with quality, cost, and delivery in mind
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
