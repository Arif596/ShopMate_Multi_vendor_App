const PageLoader = ({ text = "Loading your store" }) => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background"
  >
    <h1 className="text-3xl font-bold tracking-tight text-primary">Shop Mate</h1>

    {/* Spinner ring */}
    <div className="relative h-14 w-14">
      <div className="absolute inset-0 rounded-full border-4 border-border" />
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary motion-reduce:animate-none" />
    </div>

    <p className="text-sm text-muted-foreground">
      {text}
      <span className="animate-pulse motion-reduce:animate-none">...</span>
    </p>
  </div>
);

export default PageLoader;