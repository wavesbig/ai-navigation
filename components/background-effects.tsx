export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Soft Gradient Background */}
      <div className="absolute inset-0 bg-soft-gradient opacity-70" />
      
      {/* Multi-color Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-soft-blue/30 via-transparent to-soft-pink/30" />
        <div className="absolute inset-0 bg-gradient-to-tl from-soft-sky/20 via-transparent to-transparent" />
      </div>
      
      {/* Light Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/60" />
    </div>
  );
} 