import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  SendHorizontal,
  ArrowUp,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { AddSubcribeEmailUser } from "../../store/slices/EmailSubcribeSlice";
import { toast } from "react-toastify";

const footerLinks = {
  Company: [
    { name: "About Us", path: "/about" },
    { name: "Careers", path: "#" },
    { name: "Press", path: "#" },
    { name: "Blog", path: "#" },
  ],
  "Customer Service": [
    { name: "Contact Us", path: "/contact" },
    { name: "FAQ", path: "/faq" },
    { name: "Shipping Info", path: "#" },
    { name: "Returns", path: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", path: "#" },
    { name: "Terms of Service", path: "#" },
    { name: "Cookie Policy", path: "#" },
    { name: "Security", path: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const contacts = [
  { icon: Mail, text: "support@shopmate.com", href: "mailto:support@shopmate.com" },
  { icon: Phone, text: "+92 334 2453244", href: "tel:+923342453244" },
  { icon: MapPin, text: "Lahore, Pakistan" },
];

const trust = [
  { icon: ShieldCheck, title: "Verified vendors", text: "Every shop is checked" },
  { icon: Truck, title: "Nationwide delivery", text: "Tracked from shop to door" },
  { icon: RotateCcw, title: "Easy returns", text: "Simple, clear policy" },
  { icon: Headphones, title: "Real support", text: "Help when you need it" },
];

const Footer = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const handleEmailSubcribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please Enter Email");
      return;
    }
    dispatch(AddSubcribeEmailUser(email));
    setEmail("");
  };

  return (
    <footer className="glass border-t border-[hsla(var(--glass-border))] mt-16">
      <div className="container mx-auto px-4">
        {/* Newsletter
        <div className="glass-panel -mt-10 mb-14 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">
              Get offers before everyone else
            </h3>
            <p className="text-muted-foreground max-w-md">
              One email a week with new arrivals and vendor deals. Unsubscribe any time.
            </p>
          </div>
          <form onSubmit={handleEmailSubcribe} className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 min-w-0 px-4 py-3.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 gradient-primary text-primary-foreground rounded-xl hover:glow-on-hover animate-smooth font-semibold"
            >
              Subscribe <SendHorizontal className="w-4 h-4" />
            </button>
          </form>
        </div> */}

        {/* Main grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 pb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                ShopMate
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              A marketplace of verified vendors, with an AI assistant that helps you find the right product faster.
            </p>
            <ul className="space-y-3">
              {contacts.map((c) => (
                <li key={c.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <c.icon className="w-4 h-4 text-primary" />
                  </span>
                  {c.href ? (
                    <a href={c.href} className="hover:text-primary transition-colors">
                      {c.text}
                    </a>
                  ) : (
                    <span>{c.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links], i) => (
            <nav
              key={title}
              aria-label={title}
              className={`lg:col-span-2 ${i === 0 ? "lg:col-start-6" : ""}`}
            >
              <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Trust strip */}
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-t border-[hsla(var(--glass-border))]">
          {trust.map((t) => (
            <li key={t.title} className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <t.icon className="w-5 h-5 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight">{t.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.text}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 py-6 border-t border-[hsla(var(--glass-border))]">
          <p className="text-sm text-muted-foreground order-2 md:order-1">
            © {new Date().getFullYear()} ShopMate. All rights reserved.
          </p>

          <div className="flex items-center gap-2 order-1 md:order-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="ml-2 w-10 h-10 rounded-full gradient-primary flex items-center justify-center hover:glow-on-hover animate-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ArrowUp className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;