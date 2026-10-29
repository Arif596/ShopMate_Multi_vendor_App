import { Sparkles, Store, ShoppingCart, LayoutDashboard, ShieldCheck, Cloud } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Shopping Assistant", description: "Ask in plain words and get matching products from all vendors." },
  { icon: Store, title: "Multi-Vendor Marketplace", description: "Many independent shops selling together on one platform." },
  { icon: ShoppingCart, title: "Single Cart Checkout", description: "Buy from several vendors in one order and one payment." },
  { icon: LayoutDashboard, title: "Vendor Dashboard", description: "Manage products, orders and earnings from one panel." },
  { icon: ShieldCheck, title: "Secure Payments", description: "Encrypted checkout and role-based access for every user." },
  { icon: Cloud, title: "Cloud Scalable", description: "Deployed on the cloud to handle growing traffic smoothly." },
];

const FeatureSection = () => (
  <section className="py-16" id="features">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-foreground mb-4">Key Features</h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Everything shoppers and vendors need in one platform
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((f) => (
        <div key={f.title} className="glass-card p-6 text-center hover:glow-on-hover animate-smooth">
          <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
            <f.icon className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
          <p className="text-muted-foreground">{f.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FeatureSection;
