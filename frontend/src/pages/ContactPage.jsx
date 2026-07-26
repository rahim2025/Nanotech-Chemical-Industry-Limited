import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Building, 
  Globe,
  MessageCircle
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import useContactStore from '../store/useContactStore';

const ContactPage = () => {
  const { sendContactMessage, isLoading } = useContactStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [activeOffice, setActiveOffice] = useState('guangzhou');

  const officeLocations = {
    guangzhou: {
      label: 'Guangzhou Office',
      address: 'RM. 502, No.-2 Building, Shanxi Tower, No.-5 Yaoquan Street, Yuexiu District, Guangzhou City, China'
    },
    hongkong: {
      label: 'Hong Kong Office',
      address: 'Room-1503-09, 15/F, Causeway Bay Centre, 15-23 Sugar Street, Causeway Bay, Hong Kong'
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await sendContactMessage(formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      // Error is already handled in the store
    }
  };
  const contactInfo = [
    {
      icon: <Building className="w-6 h-6" />,
      title: "Guangzhou Office",
      details: [
        "Nanotech Chemical Industry Limited",
        "RM. 502, No.-2 Building, Shanxi Tower",
        "No.-5 Yaoquan Street, Yuexiu District",
        "Guangzhou City, China"
      ]
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Hong Kong Office",
      details: [
        "Room-1503-09, 15/F, Causeway Bay Centre",
        "15-23 Sugar Street, Causeway Bay",
        "Hong Kong"
      ]
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Numbers",
      details: [
        { text: "Mobile & WhatsApp (Hongkong): +852 6141-5689", href: "https://wa.me/85261415689", icon: <FaWhatsapp className="w-4 h-4 text-green-500 shrink-0" /> },
        { text: "Mobile & WhatsApp (China): +86 132 5051 7650", href: "https://wa.me/8613250517650", icon: <FaWhatsapp className="w-4 h-4 text-green-500 shrink-0" /> },
        {
          row: [
            { text: "Tel: 020-2904 1125", href: "tel:+862029041125" },
            { text: "Fax: 020-2825 0127" }
          ]
        }
      ]
    },    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email & Website",
      details: [
        { text: "nanotechcil@gmail.com", href: "mailto:nanotechcil@gmail.com" },
        { text: "nanotechdyechem@gmail.com", href: "mailto:nanotechdyechem@gmail.com" },
        { text: "nanotechpurchase@gmail.com", href: "mailto:nanotechpurchase@gmail.com" },
        { text: "www.nanotechchemical.com", href: "https://www.nanotechchemical.com" }
      ]
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 9:00 AM - 1:00 PM",
        "Sunday: Closed",
        "China Standard Time (CST)"
      ]
    }  ];

  return (
    <>
      <SEO 
        title="Contact Us - Get in Touch"
        description="Contact Nanotech Chemical Industry Limited. Reach our offices in Guangzhou and Hong Kong. Get quotes, technical support, and product information."
        keywords="contact nanotech chemical, chemical company contact, Guangzhou office, Hong Kong office, chemical supplier contact"
        url="https://nanotechchemical.com/contact"
      />
      <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Get in touch with our team. We're here to help with all your chemical industry needs.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Get In Touch</h2>
            
            <div className="space-y-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    <div className="space-y-1">
                      {info.details.map((detail, i) => {
                        if (typeof detail === 'string') {
                          return (
                            <p key={i} className="text-gray-600">
                              {detail}
                            </p>
                          );
                        }

                        if (detail.row) {
                          return (
                            <p key={i} className="text-gray-600 flex flex-wrap items-center gap-2">
                              {detail.row.map((segment, j) => (
                                <span key={j} className="flex items-center gap-2">
                                  {j > 0 && <span className="text-gray-400">|</span>}
                                  {segment.href ? (
                                    <a href={segment.href} className="hover:text-blue-600 hover:underline">
                                      {segment.text}
                                    </a>
                                  ) : (
                                    <span>{segment.text}</span>
                                  )}
                                </span>
                              ))}
                            </p>
                          );
                        }

                        const isExternal = detail.href?.startsWith('http');
                        return (
                          <p key={i} className="text-gray-600">
                            <a
                              href={detail.href}
                              target={isExternal ? '_blank' : undefined}
                              rel={isExternal ? 'noopener noreferrer' : undefined}
                              className="inline-flex items-center gap-1.5 hover:text-blue-600 hover:underline"
                            >
                              {detail.icon}
                              {detail.text}
                            </a>
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 p-6 bg-blue-50 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Follow Us
              </h3>
              <p className="text-gray-600 mb-4">
                Stay connected with us on social media for the latest updates and industry insights.
              </p>
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  LinkedIn
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Twitter
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  YouTube
                </button>
              </div>
            </motion.div>
          </motion.div>          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageCircle className="w-8 h-8 mr-3 text-blue-600" />
              Send us a Message
            </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales & Products</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="career">Career Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 bg-white"
                  placeholder="Please describe your inquiry in detail..."
                />
              </div><button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Find Us</h2>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {Object.entries(officeLocations).map(([key, office]) => (
                <button
                  key={key}
                  onClick={() => setActiveOffice(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeOffice === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  {office.label}
                </button>
              ))}
            </div>
            <div className="w-full h-96 rounded-lg overflow-hidden">
              <iframe
                key={activeOffice}
                title={officeLocations[activeOffice].label}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(officeLocations[activeOffice].address)}&output=embed`}
              />
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              {officeLocations[activeOffice].address}
            </p>
          </div>
        </motion.div>      </div>
    </div>
    </>
  );
};

export default ContactPage;
