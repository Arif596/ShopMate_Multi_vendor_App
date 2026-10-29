import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  SendHorizontal,
  BadgeCheck,
  Zap,
  Store,
  ArrowRight,
  Gift,
  Shirt,
  Laptop,
} from "lucide-react";

// Demo data. Baad mein yahan real AI API call lagana.
const demos = [
  {
    q: "Gift for mom under Rs 5000",
    chip: "Gift for mom",
    icon: Gift,
    keywords: ["gift", "mom", "mother", "ammi", "present", "jewel", "shawl"],
    reply: "Here are 3 thoughtful gift ideas under Rs 5,000 from verified vendors:",
    results: [
      { name: "Handmade Jewellery Box", vendor: "Noor Crafts", price: 3200, match: 98 },
      { name: "Embroidered Shawl", vendor: "Lahore Looms", price: 4500, match: 94 },
      { name: "Scented Candle Set", vendor: "Wick & Co", price: 2100, match: 89 },
    ],
  },
  {
    q: "Light coloured kurta for Eid",
    chip: "Eid kurta",
    icon: Shirt,
    keywords: ["kurta", "eid", "light", "shalwar", "kameez", "suit", "cloth", "dress"],
    reply: "Light and festive kurtas that are popular this Eid season:",
    results: [
      { name: "Cotton Kurta, Ivory", vendor: "Threadline", price: 3800, match: 97 },
      { name: "Linen Kurta, Sage", vendor: "Lahore Looms", price: 4900, match: 93 },
      { name: "Waistcoat, Beige", vendor: "Threadline", price: 5500, match: 86 },
    ],
  },
  {
    q: "Laptop table for bed",
    chip: "Laptop table",
    icon: Laptop,
    keywords: ["laptop", "table", "bed", "desk", "stand", "tray", "sofa"],
    reply: "These portable laptop tables work well on a bed or sofa:",
    results: [
      { name: "Foldable Bed Desk", vendor: "HomeNest", price: 3400, match: 96 },
      { name: "Bamboo Lap Tray", vendor: "HomeNest", price: 2700, match: 91 },
      { name: "Adjustable Stand", vendor: "Gadget Gali", price: 1900, match: 84 },
    ],
  },
];

const points = [
  { icon: Zap, title: "Plain language", text: "Ask in English or Urdu-style, just like you'd ask a friend." },
  { icon: Store, title: "All vendors at once", text: "One question searches every shop on the marketplace." },
  { icon: BadgeCheck, title: "Verified shops only", text: "Every suggestion comes from a vendor we've checked." },
];

const AUTOPLAY_MS = 8000;

// Typed text ko sab se milta julta demo dhoondta hai.
const pickDemo = (text, fallback) => {
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  let best = fallback;
  let bestScore = 0;
  demos.forEach((d, i) => {
    const score = words.filter((w) => d.keywords.some((k) => k.includes(w) || w.includes(k))).length;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return best;
};

const AIAssistantSection = () => {
  const [active, setActive] = useState(0);
  const [customQuery, setCustomQuery] = useState(null);
  const [runId, setRunId] = useState(0);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(true);
  const [shown, setShown] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);

  const sectionRef = useRef(null);

  const demo = demos[active];
  const userMessage = customQuery ?? demo.q;
  const isCustom = customQuery !== null;

  // Section screen par aaye to ek baar entrance animation chale.
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Thinking dots, phir results ek ek karke aate hain.
  useEffect(() => {
    setThinking(true);
    setShown(0);
    const timers = [];
    timers.push(
      setTimeout(() => {
        setThinking(false);
        demos[active].results.forEach((_, i) => {
          timers.push(setTimeout(() => setShown(i + 1), 160 * (i + 1)));
        });
      }, 900)
    );
    return () => timers.forEach(clearTimeout);
  }, [active, runId]);

  // Demo khud ba khud chalta rehta hai jab tak user interact na kare.
  useEffect(() => {
    if (!autoplay || hovering || !inView) return;
    const id = setInterval(() => {
      setCustomQuery(null);
      setActive((a) => (a + 1) % demos.length);
      setRunId((r) => r + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [autoplay, hovering, inView]);

  const choose = (i) => {
    setAutoplay(false);
    setCustomQuery(null);
    setActive(i);
    setRunId((r) => r + 1);
  };

  const submit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setAutoplay(false);
    setCustomQuery(text);
    setActive((a) => pickDemo(text, a));
    setRunId((r) => r + 1);
    setInput("");
  };

  const reveal = (delay = 0) => ({
    style: { transitionDelay: inView ? `${delay}ms` : "0ms" },
    className: `transition-all duration-700 ease-out motion-reduce:transition-none ${
      inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`,
  });

  const showProgress = autoplay && !hovering && inView;

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24">
      {/* Local keyframes: autoplay progress bar */}
      <style>{`
        @keyframes aiAutoplay { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) { .ai-autoplay-bar { animation: none !important; } }
      `}</style>

      {/* Soft ambient glow behind the chat */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="glass-panel relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left: copy */}
        <div className="lg:col-span-5">
          <div {...reveal(0)}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" /> AI Shopping Assistant
            </span>
            <h2 className="mb-4 text-4xl font-bold leading-[1.08] tracking-tight text-foreground md:text-5xl">
              Tell us what you need. We'll find it.
            </h2>
            <p className="mb-8 max-w-md text-lg text-muted-foreground">
              Describe it in your own words and the assistant compares every vendor for you, so you skip the endless scrolling.
            </p>
          </div>

          <ul className="mb-9 space-y-3">
            {points.map((p, i) => (
              <li
                key={p.title}
                {...reveal(150 + i * 100)}
                className={`${reveal().className} group flex items-start gap-4 rounded-2xl border border-transparent p-3 -mx-3 hover:border-border hover:bg-secondary/60`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none">
                  <p.icon className="h-5 w-5 text-primary-foreground" />
                </span>
                <div>
                  <p className="font-semibold leading-tight text-foreground">{p.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div {...reveal(500)}>
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-primary-foreground gradient-primary shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transform-none"
            >
              Start shopping
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none" />
            </Link>
          </div>
        </div>

        {/* Right: chat window */}
        <div {...reveal(200)} className={`${reveal().className} lg:col-span-7`}>
          <div
            className="glass-card overflow-hidden rounded-3xl border border-border shadow-2xl shadow-primary/10"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onFocus={() => setHovering(true)}
            onBlur={() => setHovering(false)}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/40 px-5 py-4 md:px-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full gradient-primary">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-background bg-green-500" />
                  </span>
                </span>
                <div>
                  <p className="font-semibold leading-tight text-foreground">ShopMate AI</p>
                  <p className="text-xs text-muted-foreground">Online · replies in seconds</p>
                </div>
              </div>
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                Demo
              </span>
            </div>

            {/* Autoplay progress */}
            <div className="h-0.5 w-full bg-transparent">
              {showProgress && (
                <div
                  key={`${runId}-${hovering}`}
                  className="ai-autoplay-bar h-full origin-left bg-primary/70"
                  style={{ animation: `aiAutoplay ${AUTOPLAY_MS}ms linear forwards` }}
                />
              )}
            </div>

            <div className="p-5 md:p-6">
              {/* Example chips */}
              <div className="mb-6">
                <p className="mb-2.5 text-xs font-medium text-muted-foreground">Try an example</p>
                <div className="flex flex-wrap gap-2">
                  {demos.map((d, i) => {
                    const isActive = i === active && !isCustom;
                    return (
                      <button
                        key={d.q}
                        type="button"
                        onClick={() => choose(i)}
                        aria-pressed={isActive}
                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          isActive
                            ? "border-transparent text-primary-foreground gradient-primary shadow-md shadow-primary/25"
                            : "border-border bg-secondary text-foreground hover:-translate-y-0.5 hover:border-primary/50 motion-reduce:transform-none"
                        }`}
                      >
                        <d.icon className="h-4 w-4" />
                        {d.chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conversation */}
              <div className="min-h-[350px]" aria-live="polite">
                <div className="mb-4 flex justify-end">
                  <p
                    key={`${runId}-${userMessage}`}
                    className="max-w-[85%] break-words rounded-2xl rounded-br-md px-4 py-2.5 text-primary-foreground gradient-primary shadow-md shadow-primary/20 animate-in fade-in slide-in-from-right-2 duration-300"
                  >
                    {userMessage}
                  </p>
                </div>

                {thinking ? (
                  <div
                    className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md bg-secondary px-4 py-3.5"
                    aria-label="AI is typing"
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/70 motion-reduce:animate-pulse"
                        style={{ animationDelay: `${i * 140}ms` }}
                      />
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="mb-4 w-fit max-w-[92%] rounded-2xl rounded-bl-md bg-secondary px-4 py-2.5 text-foreground">
                      {isCustom && (
                        <span className="mb-1 block text-xs text-muted-foreground">
                          Demo mode: showing the closest sample results.
                        </span>
                      )}
                      {demo.reply}
                    </p>

                    <ul className="space-y-2.5">
                      {demo.results.map((r, i) => {
                        const visible = shown > i;
                        return (
                          <li
                            key={r.name}
                            className={`group flex items-center gap-4 rounded-2xl border bg-secondary/70 p-3.5 transition-all duration-500 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-secondary hover:shadow-lg hover:shadow-primary/5 motion-reduce:transition-none motion-reduce:transform-none ${
                              i === 0 ? "border-primary/40" : "border-border"
                            } ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                          >
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-md shadow-primary/20">
                              <demo.icon className="h-6 w-6 text-primary-foreground" />
                            </span>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate font-semibold text-foreground">{r.name}</p>
                                {i === 0 && (
                                  <span className="hidden shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary sm:inline">
                                    Top pick
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                {r.vendor}
                                <BadgeCheck
                                  className="h-3.5 w-3.5 shrink-0 text-primary"
                                  aria-label="Verified vendor"
                                />
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <div className="h-1.5 max-w-[140px] flex-1 overflow-hidden rounded-full bg-border">
                                  <div
                                    className="h-full rounded-full gradient-primary transition-[width] duration-700 ease-out motion-reduce:transition-none"
                                    style={{ width: visible ? `${r.match}%` : "0%" }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">{r.match}% match</span>
                              </div>
                            </div>

                            <p className="shrink-0 font-semibold text-foreground">
                              Rs {r.price.toLocaleString()}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={submit}
                className="mt-5 flex items-center gap-2 rounded-full border border-border bg-secondary py-2 pl-5 pr-2 transition-all duration-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything, e.g. budget phone case"
                  aria-label="Ask the shopping assistant"
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transform-none"
                >
                  <SendHorizontal className="h-4 w-4 text-primary-foreground" />
                </button>
              </form>
              <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
                Demo preview. Results shown are sample data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistantSection;