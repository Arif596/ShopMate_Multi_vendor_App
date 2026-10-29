import { Link } from "react-router-dom";
import { Check, ShoppingBag, Store, ShieldCheck, ArrowRight } from "lucide-react";

const audiences = [
  {
    icon: ShoppingBag,
    title: "Shoppers",
    tagline: "Find the right product faster",
    benefits: ["Find products by simply asking the AI", "Compare many vendors in one place", "One cart, one checkout", "Track every order live"],
    cta: "Start shopping",
    to: "/products",
  },
  {
    icon: Store,
    title: "Small Vendors",
    tagline: "Grow your business online",
    benefits: ["Launch an online shop in minutes", "AI writes product descriptions for you", "Track orders and earnings in a dashboard", "Low commission, no setup fee"],
    cta: "Become a vendor",
    to: "/vendor/register",
    featured: true,
  },
  {
    icon: ShieldCheck,
    title: "Marketplace Admins",
    tagline: "Stay in full control",
    benefits: ["Approve and manage vendors easily", "See all orders and sales in one view", "Role-based secure access", "Scale on the cloud without extra setup"],
    cta: "Admin login",
    to: "/login",
  },
];

const BenefitsAudience = () => (
  <section className="py-16">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-foreground mb-4">Who It Is For</h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        ShopMate gives real benefits to everyone on the platform
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
      {audiences.map((a) => (
        <div
          key={a.title}
          className={`glass-card p-8 flex flex-col hover:glow-on-hover animate-smooth ${a.featured ? "border-2 border-primary md:-translate-y-3" : ""}`}
        >
          {a.featured && (
            <span className="self-start mb-3 text-xs px-3 py-1 rounded-full gradient-primary text-primary-foreground font-semibold">
              Most popular
            </span>
          )}
          <div className="w-14 h-14 mb-4 gradient-primary rounded-xl flex items-center justify-center">
            <a.icon className="w-7 h-7 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground">{a.title}</h3>
          <p className="text-muted-foreground mb-5">{a.tagline}</p>

          <ul className="space-y-3 mb-8 flex-1">
            {a.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-foreground">
                <span className="w-5 h-5 mt-0.5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <Link
            to={a.to}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold animate-smooth ${
              a.featured ? "gradient-primary text-primary-foreground hover:glow-on-hover" : "bg-secondary text-foreground hover:bg-secondary/70"
            }`}
          >
            {a.cta} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ))}
    </div>
  </section>
);

export default BenefitsAudience;