import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../../data/products";

const CategoryGrid = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Section screen par aate hi ek baar reveal animation chalegi
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24">
      {/* Heading */}
      <div
        className={`mx-auto mb-12 max-w-2xl text-center transition-all duration-700 ease-out motion-reduce:transition-none ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Shop by Category
        </h2>
        <p className="text-base text-muted-foreground md:text-lg">
          Discover our wide range of products across different categories
        </p>
        <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-primary" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={`/products?category=${encodeURIComponent(category.name)}`}
            style={{ transitionDelay: visible ? `${index * 90}ms` : "0ms" }}
            className={`group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm
              transition-all duration-700 ease-out motion-reduce:transition-none
              hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            {/* Image */}
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transform-none"
            />

            {/* Overlay: hover par thora gehra hota hai */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-5">
              <div>
                <h3 className="text-lg font-semibold text-white md:text-xl">
                  {category.name}
                </h3>
                <span className="mt-1 block h-0.5 w-0 rounded-full bg-primary transition-all duration-500 group-hover:w-full" />
              </div>

              {/* Arrow button: hover par slide-in hota hai */}
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 translate-x-2 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;