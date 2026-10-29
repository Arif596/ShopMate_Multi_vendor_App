import { Link } from "react-router-dom";
import { Percent, LayoutDashboard, Sparkles, BadgeCheck } from "lucide-react";

const perks = [
  { icon: Percent, title: "Low commission", description: "Keep most of what you earn. No setup fee." },
  { icon: LayoutDashboard, title: "Your own dashboard", description: "Manage products, orders and earnings in one place." },
  { icon: Sparkles, title: "AI product tools", description: "Generate product descriptions in seconds." },
  { icon: BadgeCheck, title: "Quick approval", description: "Apply today, go live once an admin approves." },
];

const BecomeVendorSection = () => (
  <section className="py-16" id="sell">
    <div className="glass-panel">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Open your shop on ShopMate
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Reach more customers without building your own website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {perks.map((p) => (
          <div key={p.title} className="glass-card p-6 text-center hover:glow-on-hover animate-smooth">
            <div className="w-14 h-14 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
              <p.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{p.title}</h3>
            <p className="text-muted-foreground">{p.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/vendor/register"
          className="inline-block px-8 py-4 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold text-lg"
        >
          Become a vendor
        </Link>
      </div>
    </div>
  </section>
);

export default BecomeVendorSection;
