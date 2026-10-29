import { useEffect, useRef, useState } from "react";
import { Search, Store, ShoppingCart, PackageCheck } from "lucide-react";

const steps = [
  { icon: Search, title: "Search or ask AI", description: "Type what you need or describe it to our assistant in plain words.", tag: "Smart search" },
  { icon: Store, title: "Compare vendors", description: "See prices, ratings and delivery from many shops in one place.", tag: "Best price" },
  { icon: ShoppingCart, title: "Checkout once", description: "Add items from different vendors to one cart and pay once.", tag: "Single payment" },
  { icon: PackageCheck, title: "Track and receive", description: "Each vendor ships their own items and you track every order.", tag: "Live tracking" },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  // Section screen par aate hi ek baar animation chalegi
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 md:py-24">
      {/* Heading */}
      <div
        className={`mx-auto mb-16 max-w-2xl text-center transition-all duration-700 ease-out motion-reduce:transition-none ${
          inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          How ShopMate Works
        </h2>
        <p className="text-base text-muted-foreground md:text-lg">
          From search to doorstep in four simple steps
        </p>
        <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-primary" />
      </div>

      <div className="relative">
        {/* Connecting line (desktop): left se right draw hoti hai */}
        <div
          aria-hidden="true"
          className={`absolute left-[12.5%] right-[12.5%] top-10 hidden origin-left border-t-2 border-dashed border-primary/40 transition-transform duration-1000 ease-out motion-reduce:transition-none lg:block ${
            inView ? "scale-x-100" : "scale-x-0"
          }`}
          style={{ transitionDelay: inView ? "300ms" : "0ms" }}
        />

        <ol className="relative grid grid-cols-1 gap-x-6 gap-y-14 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li
              key={s.title}
              style={{ transitionDelay: inView ? `${200 + i * 140}ms` : "0ms" }}
              className={`group relative rounded-2xl border border-border/60 bg-card/60 px-6 pb-7 pt-14 text-center shadow-sm backdrop-blur
                transition-all duration-700 ease-out motion-reduce:transition-none
                hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10
                ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              {/* Icon: card ke top edge par baithta hai, line ke upar */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full ring-8 ring-background gradient-primary shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none">
                    <s.icon className="h-9 w-9 text-primary-foreground transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transform-none" />
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                </div>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                {s.description}
              </p>
              <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {s.tag}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;