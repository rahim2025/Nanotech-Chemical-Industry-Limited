import { Phone, Mail } from "lucide-react";

const CONTACT_DETAILS = [
    { label: "Mobile & WhatsApp (Hongkong)", value: "+852 6141-5689", href: "https://wa.me/85261415689" },
    { label: "Mobile & WhatsApp (China)", value: "+86 132 5051 7650", href: "https://wa.me/8613250517650" },
];

const CONTACT_EMAIL = "nanotechcil@gmail.com";

// Shown wherever a product's price is "contact for pricing" instead of a fixed value.
const ContactPricingInfo = ({ compact = false }) => (
    <div className={compact ? "space-y-0.5 text-[9px] leading-tight" : "space-y-1 text-sm leading-relaxed"}>
        {CONTACT_DETAILS.map((contact) => (
            <a
                key={contact.href}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-medium text-primary hover:underline"
            >
                <Phone size={compact ? 9 : 14} className="shrink-0" />
                <span>{contact.label}: {contact.value}</span>
            </a>
        ))}
        <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-1 font-medium text-primary hover:underline"
        >
            <Mail size={compact ? 9 : 14} className="shrink-0" />
            <span>{CONTACT_EMAIL}</span>
        </a>
    </div>
);

export default ContactPricingInfo;
