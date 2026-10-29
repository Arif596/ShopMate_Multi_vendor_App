import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "react-toastify";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: backend API se connect karna
    toast.success("Thanks! We will get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  const input = "w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground";

  return (
    <section className="py-16" id="contact">
      <div className="glass-panel max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Contact Us</h2>
          <p className="text-muted-foreground">Questions about ShopMate? Send us a message.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className={input} required />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your email" className={input} required />
          <textarea name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Your message" className={input} required />
          <button type="submit" className="w-full px-8 py-4 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold flex items-center justify-center gap-2">
            <Send className="w-5 h-5" />
            Send message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
