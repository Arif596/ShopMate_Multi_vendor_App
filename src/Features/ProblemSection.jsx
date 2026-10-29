import { useEffect, useRef, useState } from "react";
import { Store, Search, Sparkles, BadgeCheck, X, Check, ArrowDown } from "lucide-react";

const problems = [
  {
    id: "sellers",
    icon: Store,
    title: "Small sellers stay invisible",
    description:
      "Local vendors cannot afford their own website, marketing or payment setup, so they miss online customers.",
    fix: "Vendors get a ready storefront and payments from day one.",
  },
  {
    id: "shoppers",
    icon: Search,
    title: "Shoppers waste time",
    description:
      "Customers jump between many shops and apps to compare prices and find the right product.",
    fix: "Every vendor is in one place, so comparing takes seconds.",
  },
  {
    id: "guidance",
    icon: Sparkles,
    title: "No smart guidance",
    description:
      "Most marketplaces only offer basic keyword search. They do not understand what the shopper really wants.",
    fix: "Our AI assistant understands a request and suggests the best matches.",
  },
];

// Har item thori der se aata hai (stagger) via CSS variable --d
const stagger = (i) => ({ "--d": `${i * 70}ms` });

/* ---------- Visuals: "Today" side ---------- */
const TodayVisual = ({ id }) => {
  if (id === "sellers")
    return (
      <div className="flex flex-wrap gap-2">
        {["Own website", "Ads and marketing", "Payment setup"].map((c, i) => (
          <span
            key={c}
            style={stagger(i)}
            className="pm-item rounded-full border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground"
          >
            {c}
          </span>
        ))}
        <p className="pm-item mt-2 w-full text-sm text-muted-foreground" style={stagger(3)}>
          Costs money before the first sale.
        </p>
      </div>
    );

  if (id === "shoppers")
    return (
      <ul className="space-y-2">
        {[
          ["App 1", "Rs 3,650"],
          ["App 2", "Rs 3,900"],
          ["App 3", "Rs 3,400"],
        ].map(([app, price], i) => (
          <li
            key={app}
            style={stagger(i)}
            className="pm-item flex items-center justify-between rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground"
          >
            <span>{app}: Foldable Bed Desk</span>
            <span>{price}</span>
          </li>
        ))}
      </ul>
    );

  return (
    <div>
      <p className="pm-item mb-3 rounded-lg bg-secondary px-3 py-2 text-sm text-foreground" style={stagger(0)}>
        table for working in bed
      </p>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {["Bed sheets (214 results)", "Dining tables (96 results)", "Work shirts (58 results)"].map((t, i) => (
          <li key={t} className="pm-item" style={stagger(i + 1)}>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ---------- Visuals: "With ShopMate" side ---------- */
const ShopMateVisual = ({ id }) => {
  if (id === "sellers")
    return (
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-md shadow-primary/25">
          <Store className="h-6 w-6 text-primary-foreground" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1 font-semibold text-foreground">
            Noor Crafts <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
          </p>
          <p className="flex items-center gap-2 text-sm text-green-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Storefront live, payments ready
          </p>
        </div>
      </div>
    );

  if (id === "shoppers")
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">Foldable Bed Desk</p>
          <p className="text-sm text-muted-foreground">Compared across 3 shops</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-muted-foreground">Best price</p>
          <p className="text-lg font-bold text-primary">Rs 3,400</p>
        </div>
      </div>
    );

  return (
    <div>
      <p className="mb-3 text-sm text-foreground">Understood: a portable laptop desk for use on a bed.</p>
      <div className="flex flex-wrap gap-1.5">
        {["Foldable", "Under Rs 5,000", "Verified vendor"].map((t, i) => (
          <span
            key={t}
            style={stagger(i + 2)}
            className="pm-item rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs text-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

const ProblemSection = () => {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const tabRefs = useRef([]);
  const current = problems[active];

  // Section screen par aaye to ek baar entrance animation chale
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keyboard: arrow keys se tabs badlein
  const onKeyDown = (e) => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const next = e.key === "Home" ? 0 : problems.length - 1;
      setActive(next);
      tabRefs.current[next]?.focus();
      return;
    }
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (active + keys[e.key] + problems.length) % problems.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const reveal = (delay = 0) => ({
    style: { transitionDelay: inView ? `${delay}ms` : "0ms" },
    className: `transition-all duration-700 ease-out motion-reduce:transition-none ${
      inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`,
  });

  return (
    <section ref={sectionRef} className="py-16 md:py-24" aria-labelledby="problem-heading">
      <style>{`
        @keyframes pm-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .pm-fade { animation: pm-fade .4s ease-out both; }
        .pm-item { animation: pm-fade .45s ease-out both; animation-delay: calc(var(--d, 0ms) + 120ms); }
        @media (prefers-reduced-motion: reduce) { .pm-fade, .pm-item { animation: none; } }
      `}</style>

      <div {...reveal(0)} className={`${reveal().className} mb-12 max-w-3xl`}>
        <h2
          id="problem-heading"
          className="mb-5 text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl"
        >
          Shopping online is broken on both sides
        </h2>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
          Small vendors can't get found, and customers can't get a straight answer. Pick a problem to see how ShopMate fixes it.
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Problem selector */}
        <div
          role="tablist"
          aria-label="Problems"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="flex flex-col gap-3 lg:col-span-5"
        >
          {problems.map((p, i) => {
            const isActive = i === active;
            return (
              <button
                key={p.id}
                ref={(el) => (tabRefs.current[i] = el)}
                role="tab"
                id={`problem-tab-${p.id}`}
                aria-selected={isActive}
                aria-controls="problem-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(i)}
                style={{ transitionDelay: inView ? `${150 + i * 100}ms` : "0ms" }}
                className={`flex gap-4 rounded-2xl border p-5 text-left transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none ${
                  inView ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
                } ${
                  isActive
                    ? "border-primary bg-secondary shadow-lg shadow-primary/10"
                    : "border-border hover:border-primary/40 hover:bg-secondary/50"
                }`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                    isActive ? "gradient-primary shadow-md shadow-primary/25" : "bg-secondary"
                  }`}
                >
                  <p.icon
                    className={`h-5 w-5 transition-colors ${
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block font-semibold transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {p.title}
                  </span>
                  {/* Description smooth expand hoti hai */}
                  <span
                    className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
                      isActive ? "mt-1.5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <span className="overflow-hidden text-sm text-muted-foreground">{p.description}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Before / After panel */}
        <div
          role="tabpanel"
          id="problem-panel"
          aria-labelledby={`problem-tab-${current.id}`}
          {...reveal(300)}
          className={`${reveal().className} glass-card flex flex-col rounded-3xl border border-border p-6 shadow-xl shadow-primary/5 md:p-8 lg:col-span-7`}
        >
          <div key={current.id} className="flex flex-1 flex-col">
            <div className="pm-fade">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary">
                  <X className="h-3 w-3" />
                </span>
                Today
              </p>
              <div className="rounded-2xl border border-dashed border-border p-5">
                <TodayVisual id={current.id} />
              </div>
            </div>

            {/* Today -> ShopMate connector */}
            <div className="pm-fade flex items-center gap-3 py-3" style={{ animationDelay: "120ms" }} aria-hidden="true">
              <div className="h-px flex-1 bg-border" />
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                <ArrowDown className="h-4 w-4" />
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="pm-fade" style={{ animationDelay: "200ms" }}>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                  <Check className="h-3 w-3" />
                </span>
                With ShopMate
              </p>
              <div className="rounded-2xl border border-primary/50 bg-secondary p-5 shadow-md shadow-primary/10">
                <ShopMateVisual id={current.id} />
              </div>
            </div>

            <p className="pm-fade mt-auto pt-6 text-lg font-semibold text-foreground" style={{ animationDelay: "300ms" }}>
              {current.fix}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;