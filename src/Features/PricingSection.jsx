import { Link } from "react-router-dom";
import { Check, Percent } from "lucide-react";

const plans = [
  {
    name: "Starter",
    tagline: "Try ShopMate with a small catalogue.",
    price: "Free",
    period: "",
    commission: "5%",
    features: ["Up to 10 products", "Basic vendor dashboard"],
    cta: "Start for free",
    highlight: false,
  },
  {
    name: "Growth",
    tagline: "For shops growing their online sales.",
    price: "Rs 2,999",
    period: "/month",
    commission: "3%",
    features: ["Up to 200 products", "AI product descriptions", "Order analytics"],
    cta: "Choose Growth",
    highlight: true,
  },
  {
    name: "Pro",
    tagline: "For high-volume vendors.",
    price: "Rs 7,999",
    period: "/month",
    commission: "1%",
    features: ["Unlimited products", "AI descriptions and insights", "Priority support"],
    cta: "Choose Pro",
    highlight: false,
  },
];

const PricingSection = () => (
  <section className="py-16" id="pricing" aria-labelledby="pricing-heading">
    <div className="text-center max-w-2xl mx-auto mb-14">
      <h2
        id="pricing-heading"
        className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-4"
      >
        Simple pricing for vendors
      </h2>
      <p className="text-lg text-muted-foreground">
        Shopping is free for customers. Pick the plan that fits your business and change it as you grow.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
      {plans.map((p) => (
        <article
          key={p.name}
          className={`relative flex flex-col rounded-3xl p-7 md:p-8 transition-colors ${
            p.highlight
              ? "glass-card border-2 border-primary md:-my-4 md:py-12 shadow-xl"
              : "glass-card border border-border"
          }`}
        >
          {p.highlight && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3.5 py-1 rounded-full gradient-primary text-primary-foreground font-semibold whitespace-nowrap">
              Most popular
            </span>
          )}

          <h3 className="text-xl font-semibold text-foreground">{p.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 min-h-[40px]">{p.tagline}</p>

          <p className="mt-5 mb-6 flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">{p.price}</span>
            {p.period && <span className="text-muted-foreground">{p.period}</span>}
          </p>

          <Link
            to="/vendor/register"
            className={`text-center px-6 py-3.5 rounded-xl font-semibold animate-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              p.highlight
                ? "gradient-primary text-primary-foreground hover:glow-on-hover"
                : "bg-secondary text-foreground border border-border hover:border-primary/60"
            }`}
          >
            {p.cta}
          </Link>

          <div className="flex items-center justify-between gap-3 bg-secondary rounded-xl px-4 py-3 mt-6">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Percent className="w-4 h-4 text-primary" /> Commission per sale
            </span>
            <span className="text-lg font-bold text-foreground">{p.commission}</span>
          </div>

          <ul className="space-y-3.5 mt-6 flex-1">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>

    <p className="text-center text-sm text-muted-foreground mt-10">
      All prices are in PKR. Not sure which plan to pick?{" "}
      <Link to="/contact" className="text-primary font-medium hover:underline">
        Talk to our team
      </Link>
      .
    </p>
  </section>
);

export default PricingSection;