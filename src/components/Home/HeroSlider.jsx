import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    id: 1,
    title: "Premium Electronics",
    subtitle: "Discover the latest tech innovations",
    description: "Up to 50% off on premium headphones, smartwatches, and more",
    image: "/electronics.jpg",
    cta: "Shop Electronics",
    url: "/products?category=Electronics",
  },
  {
    id: 2,
    title: "Fashion Forward",
    subtitle: "Style meets comfort",
    description: "New arrivals in designer clothing and accessories",
    image: "/fashion.jpg",
    cta: "Explore Fashion",
    url: "/products?category=Fashion",
  },
  {
    id: 3,
    title: "Home & Garden",
    subtitle: "Transform your space",
    description: "Beautiful furniture and decor for every home",
    image: "/furniture.jpg",
    cta: "Shop Home",
    url: "/products?category=Home & Garden",
  },
];

const AUTOPLAY_MS = 8000;

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((prev) => (prev + 1) % SLIDES.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length),
    []
  );

  // Autoplay: pauses on hover/focus, skipped for reduced-motion users,
  // and restarts its countdown whenever the slide changes.
  useEffect(() => {
    if (isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused, current, next]);

  const slide = SLIDES[current];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative h-[60vh] min-h-[26rem] overflow-hidden rounded-2xl bg-neutral-900 lg:h-[70vh]"
    >
      {/* Background images, stacked so they crossfade */}
      {SLIDES.map((s, i) => (
        <img
          key={s.id}
          src={s.image}
          alt=""
          aria-hidden="true"
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dark gradient keeps the text readable on any photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

      {/* Content */}
      <div
        role="group"
        aria-roledescription="slide"
        aria-label={`${current + 1} of ${SLIDES.length}`}
        aria-live={isPaused ? "polite" : "off"}
        className="relative flex h-full items-center px-6 sm:px-12 lg:px-16"
      >
        <div className="max-w-xl text-white">
          <p className="text-sm font-medium text-white/80 sm:text-base">
            {slide.subtitle}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
            {slide.description}
          </p>
          <Link
            to={slide.url}
            className="mt-8 inline-flex items-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
          >
            {slide.cta}
          </Link>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-6 flex items-center sm:left-12 lg:left-16">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current}
            className="group flex h-6 items-center px-1 focus-visible:outline-none"
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 motion-reduce:transition-none group-focus-visible:ring-2 group-focus-visible:ring-white ${
                i === current
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 group-hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Arrows */}
      <div className="absolute bottom-4 right-6 hidden gap-2 sm:flex sm:right-12 lg:right-16">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;