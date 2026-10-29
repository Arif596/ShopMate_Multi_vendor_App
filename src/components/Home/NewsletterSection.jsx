import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AddSubcribeEmailUser } from "../../store/slices/EmailSubcribeSlice";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleSubscribe = (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Please enter your email address to subscribe.");
      return;
    }

    dispatch(AddSubcribeEmailUser(trimmedEmail));
    setEmail("");
  };

  return (
    <section className="py-12 lg:py-16">
      <div className="grid items-center gap-8 rounded-2xl border border-border bg-muted/40 px-6 py-10 sm:px-10 lg:grid-cols-2 lg:gap-12 lg:px-14 lg:py-12">
        {/* Text */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Get early access to deals and new arrivals
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
            Join our newsletter for exclusive offers, product launches, and
            shopping tips. One email a week, nothing more.
          </p>
        </div>

        {/* Form */}
        <div>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="relative flex-1">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 w-full rounded-lg border border-border bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Subscribe
            </button>
          </form>

          <p className="mt-3 text-xs text-muted-foreground">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;