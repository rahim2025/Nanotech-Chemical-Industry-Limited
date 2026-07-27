import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Building,
  Target,
  History,
  Sparkles,
  ShieldCheck,
  Users,
  Handshake,
  Factory,
  Award,
  CheckCircle2,
  Quote,
  Gem
} from "lucide-react";
import SEO from "../components/SEONative";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

const Reveal = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    variants={fadeUp}
    className={className}
  >
    {children}
  </motion.div>
);

const timeline = [
  {
    era: "1930s",
    generation: "First Generation",
    title: "The Founding Era",
    text: "Our story began nearly a century ago when our grandfather established a chemical trading business during an era when chemicals were transported and stored in large glass bottles, long before the introduction of plastic containers and steel drums. Built on honesty, integrity, and unwavering commitment to quality, his business earned the trust of customers and laid the foundation for a legacy that continues today."
  },
  {
    era: "Second Generation",
    generation: "Second Generation",
    title: "Growth & Technical Expertise",
    text: "The second generation expanded the business by strengthening relationships with manufacturers, developing deep technical expertise, and serving a growing customer base across the chemical and textile industries."
  },
  {
    era: "Today",
    generation: "Third Generation",
    title: "A Modern Global Vision",
    text: "Today, as the third generation, we proudly continue this heritage with a modern global vision. Combining decades of industry knowledge with international sourcing capabilities, we have evolved into a comprehensive global supply partner serving customers across Asia, Europe, the Middle East, Africa, and the Americas."
  }
];

const productPortfolio = [
  "Industrial Chemicals",
  "Textile Chemicals & Auxiliaries",
  "Dyes & Pigments",
  "Fibers",
  "Yarns",
  "Fabrics",
  "Ready-Made Garments",
  "Fashion Accessories",
  "Home Textiles",
  "Home Decoration Products"
];

const coreStrengths = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Quality",
    text: "Quality is the foundation of our business. Every product is sourced from carefully selected manufacturers and supplied with strict quality control standards to ensure consistency, reliability, and customer satisfaction."
  },
  {
    icon: Users,
    title: "Professional Technical Solutions",
    text: "Our highly qualified technical team provides practical support for product selection, application guidance, troubleshooting, and process optimization. We help customers identify the right solutions for their production requirements."
  },
  {
    icon: Handshake,
    title: "Reliable After-Sales Service",
    text: "Customer satisfaction is our highest priority. We remain committed to providing prompt communication, technical assistance, and continuous support even after delivery."
  },
  {
    icon: Factory,
    title: "Strong China Sourcing Network",
    text: "Through our extensive network of manufacturers across Mainland China, we provide competitive sourcing solutions while maintaining strict quality standards and dependable supply."
  },
  {
    icon: Globe,
    title: "Global Supply Chain Management",
    text: "From supplier selection and quality coordination to export documentation and international logistics, we manage every stage of the supply chain with professionalism and efficiency."
  }
];

const industries = [
  "Textile & Dyeing",
  "Garment Manufacturing",
  "Fashion & Apparel",
  "Home Textile & Home Furnishing",
  "Industrial Manufacturing",
  "Chemical Distribution",
  "Import & Export Trading",
  "Retail & Wholesale Supply"
];

const coreValues = [
  "Integrity in Every Business Relationship",
  "Commitment to Genuine Quality",
  "Customer-First Service",
  "Technical Excellence",
  "Continuous Innovation",
  "Long-Term Partnership",
  "Professionalism",
  "Responsibility",
  "Sustainable Growth"
];

const whyChooseUs = [
  "Since the 1930s — Nearly a Century of Family Business Heritage",
  "Three Generations of Industry Experience",
  "Strong Manufacturing & Sourcing Network Across Mainland China",
  "International Trading Platform Based in Hong Kong",
  "100% Genuine Quality Commitment",
  "Highly Qualified Technical Team",
  "Professional Technical Solutions",
  "Reliable After-Sales Service",
  "Efficient Global Logistics & Export Support",
  "One Trusted Partner for Chemicals, Textiles, Fashion & Home Products"
];

const AboutUsPage = () => {
  return (
    <>
      <SEO
        title="About Us - Nearly a Century of Trust, Three Generations of Excellence"
        description="Nanotech Chemical Industry Limited is a family-owned international sourcing and trading company with a legacy dating back to the 1930s, serving the chemical, textile, fashion, and home living industries worldwide."
        keywords="about nanotech chemical, chemical sourcing company, family business heritage, Guangzhou sourcing, Hong Kong trading company, textile chemicals supplier"
        url="https://nanotechchemical.com/about"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "url": "https://nanotechchemical.com/about",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nanotechchemical.com/" },
              { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://nanotechchemical.com/about" }
            ]
          },
          "mainEntity": {
            "@type": "Organization",
            "name": "Nanotech Chemical Industry Limited",
            "foundingDate": "1930",
            "slogan": "Nearly a Century of Trust. Three Generations of Excellence.",
            "description": "A family-owned international sourcing and trading company, now in its third generation, connecting reliable manufacturers across Mainland China with global customers in chemicals, textiles, fashion, and home living products."
          }
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="pointer-events-none absolute -top-32 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm font-medium text-amber-300 mb-6">
              <History size={14} />
              Since the 1930s
            </span>

            <div className="size-24 rounded-full overflow-hidden bg-white border-4 border-amber-400/30 shadow-[0_0_40px_rgba(251,191,36,0.15)] mb-6">
              <img src="/logo.png" alt="Nanotech Chemical Logo" className="w-full h-full object-cover" />
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-5">
              Nearly a Century of Trust.
              <br />
              <span className="text-amber-300">Three Generations of Excellence.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
              Welcome to Nanotech Chemical Industry Limited — a trusted international sourcing
              and trading company with a family legacy dating back to the 1930s.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story / Timeline */}
      <section className="bg-base-100 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Reveal className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Our Story</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">A Legacy Built Across Three Generations</h2>
          </Reveal>

          <div className="relative">
            <div className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent" />
            <div className="space-y-10">
              {timeline.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.1} className="relative flex gap-6 md:gap-8">
                  <div className="relative z-10 flex items-center justify-center size-8 md:size-10 rounded-full bg-primary text-primary-content font-display font-bold text-xs md:text-sm shrink-0 shadow-lg shadow-primary/30">
                    {index + 1}
                  </div>
                  <div className="pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {item.era}
                    </span>
                    <h3 className="text-xl font-bold mt-1 mb-2">{item.title}</h3>
                    <p className="text-base-content/70 leading-relaxed">{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2} className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <p className="text-base-content/80 leading-relaxed">
              Our sourcing operations are strategically based in <strong className="text-primary">Mainland China</strong>,
              while Nanotech Chemical Industry Limited, headquartered in <strong className="text-primary">Hong Kong</strong>,
              manages our international trading activities, enabling efficient global procurement, logistics,
              documentation, and customer support.
            </p>
          </Reveal>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-base-200 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <Reveal className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">What We Do</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Complete Sourcing and Supply Solutions</h2>
            <p className="text-base-content/70 max-w-2xl mx-auto leading-relaxed">
              We provide complete sourcing and supply solutions for a broad range of industries, offering
              carefully selected products from reliable manufacturers.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {productPortfolio.map((product, index) => (
              <Reveal key={product} delay={index * 0.04}>
                <div className="h-full flex items-center justify-center text-center rounded-xl border border-base-300 bg-base-100 px-3 py-5 text-sm font-medium hover:border-primary/40 hover:shadow-md transition-all">
                  {product}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="text-center mt-10">
            <p className="text-base-content/70 max-w-2xl mx-auto leading-relaxed italic">
              Whether you require industrial raw materials, textile solutions, or finished consumer products,
              we provide dependable sourcing through one trusted partner.
            </p>
          </Reveal>
        </div>
      </section>

      {/* More Than a Trading Company */}
      <section className="bg-base-100 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Reveal className="relative rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 md:p-12 overflow-hidden">
            <Quote className="absolute top-6 right-6 text-amber-300/20 size-16 md:size-20" />
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-300 mb-4">
              More Than a Trading Company
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-white/90 mb-4">
              We believe that successful business is built on more than competitive pricing. We believe in
              creating long-term partnerships by delivering genuine products, professional technical support,
              responsive communication, and dependable after-sales service.
            </p>
            <p className="text-lg md:text-xl leading-relaxed font-display font-semibold text-amber-300">
              Our responsibility does not end when the shipment leaves the factory — it begins there.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Strengths */}
      <section className="bg-base-200 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <Reveal className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Our Core Strengths</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Why Businesses Trust Us</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreStrengths.map((strength, index) => (
              <Reveal key={strength.title} delay={index * 0.08}>
                <div className="h-full rounded-2xl bg-base-100 border border-base-300 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <strength.icon size={22} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{strength.title}</h3>
                  <p className="text-sm text-base-content/70 leading-relaxed">{strength.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="bg-base-100 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Reveal className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Industries We Serve</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Supporting a Wide Range of Industries
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <span
                key={industry}
                className="rounded-full border border-primary/30 bg-primary/5 text-primary px-4 py-2 text-sm font-medium"
              >
                {industry}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-base-200 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal>
              <div className="h-full rounded-2xl bg-base-100 border border-base-300 p-8">
                <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-5">
                  <Sparkles size={22} />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Our Vision</h3>
                <p className="text-base-content/70 leading-relaxed">
                  To become one of the world's most trusted international sourcing and trading companies by
                  delivering genuine quality products, innovative technical solutions, and exceptional customer
                  service across the chemical, textile, fashion, and home living industries.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl bg-base-100 border border-base-300 p-8">
                <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-5">
                  <Target size={22} />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Our Mission</h3>
                <p className="text-base-content/70 leading-relaxed">
                  To connect reliable manufacturers with global customers through professional sourcing,
                  uncompromising quality, technical excellence, efficient logistics, and long-term partnerships
                  built on trust.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-base-100 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <Reveal className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Our Core Values</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">What Guides Everything We Do</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreValues.map((value, index) => (
              <Reveal key={value} delay={index * 0.04}>
                <div className="flex items-center gap-3 rounded-xl border border-base-300 bg-base-100 px-4 py-4 h-full">
                  <Gem className="text-primary shrink-0" size={18} />
                  <span className="text-sm font-medium">{value}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-base-200 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <Reveal className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Why Choose Us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Why Choose Nanotech Chemical Industry Limited?
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whyChooseUs.map((reason, index) => (
              <Reveal key={reason} delay={index * 0.04}>
                <div className="flex items-start gap-3 rounded-xl bg-base-100 border border-base-300 px-5 py-4 h-full">
                  <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
                  <span className="text-sm md:text-base font-medium">{reason}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="bg-base-100 py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Reveal>
            <Award className="text-primary mx-auto mb-5" size={36} />
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Our Promise</p>
            <p className="text-base-content/70 leading-relaxed mb-2">
              For nearly a century, one principle has guided every generation of our family:
            </p>
            <p className="font-display text-xl md:text-2xl font-semibold mb-6 leading-relaxed">
              Deliver genuine quality. Provide practical technical solutions. Stand behind every product.
              Build lasting partnerships based on trust.
            </p>
            <p className="text-base-content/70 leading-relaxed">
              At Nanotech Chemical Industry Limited, we are not simply supplying products — we are connecting
              global manufacturers with international markets, delivering confidence, expertise, and long-term
              value to every customer.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Offices & Contact */}
      <section className="bg-base-200 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <Reveal className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Visit Us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Our Offices and Contact</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Reveal>
              <div className="h-full rounded-2xl bg-base-100 border border-base-300 p-6">
                <h3 className="flex items-center gap-2 font-bold text-lg mb-4">
                  <Building className="text-primary" size={20} />
                  Guangzhou Office
                </h3>
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary shrink-0 mt-1" size={18} />
                  <p className="text-base-content/70 text-sm leading-relaxed">
                    RM. 502, No.-2 Building, Shanxi Tower, No.-5 Yaoquan Street, Yuexiu District, Guangzhou
                    City, China
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl bg-base-100 border border-base-300 p-6">
                <h3 className="flex items-center gap-2 font-bold text-lg mb-4">
                  <Building className="text-primary" size={20} />
                  Hong Kong Office
                </h3>
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary shrink-0 mt-1" size={18} />
                  <p className="text-base-content/70 text-sm leading-relaxed">
                    Room-1503-09, 15/F, Causeway Bay Centre, 15-23 Sugar Street, Causeway Bay, Hong Kong
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="rounded-2xl bg-base-100 border border-base-300 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Phone className="text-primary shrink-0" size={18} />
                  <div>
                    <p className="text-xs text-base-content/60">Tel</p>
                    <p className="font-medium text-sm">020-2904 1125</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-primary shrink-0" size={18} />
                  <a href="mailto:nanotechcil@gmail.com" className="font-medium text-sm hover:text-primary break-all">
                    nanotechcil@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="text-primary shrink-0" size={18} />
                  <a
                    href="http://www.nanotechchemical.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sm hover:text-primary"
                  >
                    www.nanotechchemical.com
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Get in Touch With Us</h2>
            <p className="text-white/70 mb-8">
              Interested in our products? Have questions? We'd love to hear from you!
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 text-slate-950 font-semibold px-8 py-3 hover:bg-amber-300 transition-colors"
            >
              Contact Us
            </Link>
            <p className="mt-8 text-xs uppercase tracking-widest text-white/40">
              Since the 1930s • Three Generations of Excellence • Your Trusted Global Sourcing Partner
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default AboutUsPage;
