import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Star, BadgeCheck, MapPin, Package, ArrowRight, Crown } from "lucide-react";

// Abhi dummy data. Backend ready hone par prop se pass karo: <TopVendors vendors={data} />
const defaultVendors = [
  { id: 1, shop_name: "Noor Crafts", description: "Handmade gifts, jewellery and home decor made by local artisans.", category: "Handmade", city: "Lahore", rating: 4.9, reviews: 1284, products: 142, since: 2022, featured: true },
  { id: 2, shop_name: "Lahore Looms", description: "Hand-woven shawls and kurtas", category: "Fashion", city: "Lahore", rating: 4.8, reviews: 968, products: 210, since: 2021 },
  { id: 3, shop_name: "HomeNest", description: "Furniture and home essentials", category: "Home", city: "Karachi", rating: 4.7, reviews: 742, products: 318, since: 2022 },
  { id: 4, shop_name: "Gadget Gali", description: "Phone and laptop accessories", category: "Electronics", city: "Islamabad", rating: 4.6, reviews: 1530, products: 460, since: 2021 },
  { id: 5, shop_name: "Threadline", description: "Modern menswear and Eid collections", category: "Fashion", city: "Faisalabad", rating: 4.7, reviews: 615, products: 175, since: 2023 },
  { id: 6, shop_name: "Glow Botanica", description: "Natural skincare and beauty care", category: "Beauty", city: "Lahore", rating: 4.8, reviews: 530, products: 96, since: 2023 },
  { id: 7, shop_name: "TechHive", description: "Smart watches, earbuds and gadgets", category: "Electronics", city: "Rawalpindi", rating: 4.5, reviews: 892, products: 280, since: 2022 },
  { id: 8, shop_name: "Wick & Co", description: "Scented candles and gift sets", category: "Handmade", city: "Karachi", rating: 4.9, reviews: 410, products: 64, since: 2024 },
];

const categories = ["All", "Fashion", "Home", "Electronics", "Beauty", "Handmade"];

const Rating = ({ value, reviews }) => (
  <span className="inline-flex items-center gap-1 text-sm text-foreground">
    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    <span className="font-semibold">{value.toFixed(1)}</span>
    <span className="text-muted-foreground">({reviews.toLocaleString()})</span>
  </span>
);

const TopVendors = ({ vendors = defaultVendors }) => {
  const [cat, setCat] = useState("All");

  const featured = useMemo(() => vendors.find((v) => v.featured), [vendors]);
  const list = useMemo(
    () => vendors.filter((v) => v !== featured && (cat === "All" || v.category === cat)),
    [vendors, featured, cat]
  );

  if (!vendors.length) return null;

  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-foreground mb-4">Top Vendors</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Verified shops trusted by thousands of customers
        </p>
      </div>

      {/* Featured vendor */}
      {featured && (
        <Link
          to={`/vendor/${featured.id}`}
          className="glass-panel mb-8 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-center hover:glow-on-hover animate-smooth"
        >
          <div className="w-24 h-24 gradient-primary rounded-2xl flex items-center justify-center text-4xl font-bold text-primary-foreground">
            {featured.shop_name[0]}
          </div>
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-500 mb-2">
              <Crown className="w-3.5 h-3.5" /> Vendor of the month
            </span>
            <h3 className="text-3xl font-bold text-foreground flex items-center gap-2">
              {featured.shop_name} <BadgeCheck className="w-6 h-6 text-primary" />
            </h3>
            <p className="text-muted-foreground mt-1 max-w-xl">{featured.description}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm text-muted-foreground">
              <Rating value={featured.rating} reviews={featured.reviews} />
              <span className="inline-flex items-center gap-1"><Package className="w-4 h-4" /> {featured.products} products</span>
              <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> {featured.city}</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold">
            Visit shop <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              c === cat ? "gradient-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/70"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Vendor grid */}
      {list.length === 0 ? (
        <p className="text-center text-muted-foreground">No vendors in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((v) => (
            <Link
              key={v.id}
              to={`/vendor/${v.id}`}
              className="glass-card p-6 flex flex-col hover:glow-on-hover animate-smooth"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {v.shop_name[0]}
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary text-primary">{v.category}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-1.5">
                {v.shop_name} <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4 flex-1">{v.description}</p>
              <Rating value={v.rating} reviews={v.reviews} />
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {v.city}</span>
                <span className="inline-flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {v.products} products</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link to="/vendors" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
          View all vendors <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default TopVendors;