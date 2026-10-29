import { Cloud, Database, Server, Globe } from "lucide-react";

// IMPORTANT: Yahan wohi likho jo tumne asal mein deploy kiya hai.
const stack = [
  { icon: Globe, layer: "Frontend", service: "Vercel / AWS Amplify", note: "React app served from a global CDN" },
  { icon: Server, layer: "Backend API", service: "AWS EC2 / Render", note: "Node.js and Express REST API" },
  { icon: Database, layer: "Database", service: "Neon PostgreSQL (on AWS)", note: "Managed, serverless Postgres with backups" },
  { icon: Cloud, layer: "AI Service", service: "Claude / Gemini API", note: "Powers the shopping assistant" },
];

const CloudSection = () => (
  <section className="py-16">
    <div className="glass-panel">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-foreground mb-4">Built on the Cloud</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          ShopMate runs on Amazon Web Services infrastructure, so it scales with demand and stays available.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stack.map((s) => (
          <div key={s.layer} className="glass-card p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
              <s.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{s.layer}</p>
            <h3 className="text-lg font-semibold text-foreground">{s.service}</h3>
            <p className="text-sm text-muted-foreground mt-2">{s.note}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CloudSection;
