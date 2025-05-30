import { MapPin, Phone, Mail, Globe, Building, Users, Target } from "lucide-react";
import SEO from "../components/SEO";

const AboutUsPage = () => {
  return (
    <>
      <SEO 
        title="About Us - Leading Chemical Manufacturing Company"
        description="Learn about Nanotech Chemical Industry Limited - a premier chemical manufacturing company with offices in Guangzhou and Hong Kong, specializing in industrial and research chemicals."
        keywords="about nanotech chemical, chemical company, chemical manufacturing company, Guangzhou chemicals, Hong Kong chemicals, chemical industry experience"
        url="https://nanotechchemical.com/about"
      />
      <div className="container mx-auto px-4 pt-20 pb-10">
      <div className="max-w-5xl mx-auto">
        {/* Header with logo and company name */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="size-28 rounded-full overflow-hidden bg-white border-4 border-primary/20 shadow-lg mb-4">
            <img
              src="/logo.png"
              alt="Nanotech Chemical Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">
            NANOTECH CHEMICAL INDUSTRY LIMITED
          </h1>
          <p className="text-lg md:text-xl italic text-base-content/70 text-center mt-2">
            Quality Cost & Delivery Our Prime Concern
          </p>
        </div>

        {/* Company description */}
        <div className="card bg-base-100 shadow-md rounded-xl overflow-hidden mb-8">
          <div className="card-body">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Users className="text-primary" />
              About Our Company
            </h2>
            <p className="text-base-content/80 mb-4">
              Nanotech Chemical Industry Limited is a leading chemical manufacturing company 
              with operations in China and Hong Kong. We specialize in high-quality chemical 
              products serving various industries globally.
            </p>
            <p className="text-base-content/80">
              With a focus on quality, cost-effectiveness, and reliable delivery, we have 
              established ourselves as a trusted partner for businesses seeking dependable 
              chemical solutions. Our experienced team ensures that all products meet the 
              highest standards of quality and safety.
            </p>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="card bg-base-100 shadow-md rounded-xl overflow-hidden mb-8">
          <div className="card-body">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Target className="text-primary" />
              Our Mission & Values
            </h2>
            <div className="text-base-content/80">
              <p className="mb-4">
                <strong className="text-primary">Mission:</strong> To deliver high-quality chemical products with 
                competitive pricing and reliable delivery services to our global customers.
              </p>
              <p>
                <strong className="text-primary">Our Values:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Quality - We never compromise on the quality of our products</li>
                <li>Cost-effectiveness - We offer competitive pricing without sacrificing quality</li>
                <li>Delivery - We ensure timely and reliable delivery to all our customers</li>
                <li>Customer Satisfaction - We put our customers' needs first</li>
                <li>Innovation - We continuously improve our products and processes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Office Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Guangzhou Office */}
          <div className="card bg-base-100 shadow-md rounded-xl overflow-hidden h-full">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                <Building className="text-primary" />
                Guangzhou Office
              </h2>
              <div className="flex items-start gap-3 mt-4">
                <MapPin className="text-primary shrink-0 mt-1" />
                <p className="text-base-content/80">
                  RM. 502, No.-2 Building, Shanxi Tower, No.-5 Yaoquan Street, 
                  Yuexiu District, Guangzhou City, China
                </p>
              </div>
            </div>
          </div>

          {/* Hong Kong Office */}
          <div className="card bg-base-100 shadow-md rounded-xl overflow-hidden h-full">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                <Building className="text-primary" />
                Hong Kong Office
              </h2>
              <div className="flex items-start gap-3 mt-4">
                <MapPin className="text-primary shrink-0 mt-1" />
                <p className="text-base-content/80">
                  Room-1503-09, 15/F, Causeway Bay Centre, 15-23 Sugar Street, 
                  Causeway Bay, Hong Kong
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card bg-base-100 shadow-md rounded-xl overflow-hidden mb-8">
          <div className="card-body">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Phone className="text-primary" />
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="text-primary shrink-0" />
                  <div>
                    <p className="text-sm text-base-content/60">Cell</p>
                    <p className="font-medium">+8613250517650</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="text-primary shrink-0" />
                  <div>
                    <p className="text-sm text-base-content/60">Tel</p>
                    <p className="font-medium">020-29041125</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="text-primary shrink-0" />
                  <div>
                    <p className="text-sm text-base-content/60">Fax</p>
                    <p className="font-medium">020-28250127</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-primary shrink-0" />
                  <a href="mailto:purchase@nanotechcil.com" className="hover:text-primary">
                    info@nanotechchemical.com
                  </a>
                </div>
                
                
                

                
                <div className="flex items-center gap-3">
                  <Globe className="text-primary shrink-0" />
                  <a href="http://www.nanotechchemical.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    www.nanotechchemical.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="card bg-primary text-primary-content shadow-lg rounded-xl overflow-hidden">
          <div className="card-body text-center">
            <h2 className="card-title justify-center mb-2">Get in Touch With Us</h2>
            <p className="mb-4">Interested in our products? Have questions? We'd love to hear from you!</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AboutUsPage;