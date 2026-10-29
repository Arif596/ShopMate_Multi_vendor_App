const stats = [
  { value: "120+", label: "Verified Vendors" },
  { value: "4,800+", label: "Products" },
  { value: "15k+", label: "Orders Delivered" },
  { value: "24/7", label: "AI Assistant" },
];

const StatsSection = () => (
  <section className="py-16">
    <div className="glass-panel grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {stats.map((s) => (
        <div key={s.label}>
          <p className="text-4xl font-bold text-primary">{s.value}</p>
          <p className="text-muted-foreground mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default StatsSection;
