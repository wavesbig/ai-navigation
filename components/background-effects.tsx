export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Aurora Effects */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-aurora-1 blur-[120px] animate-aurora rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-aurora-2 blur-[120px] animate-aurora [animation-delay:2s] -rotate-12" />
        <div className="absolute top-1/4 right-1/4 w-full h-full bg-aurora-3 blur-[120px] animate-aurora [animation-delay:4s] rotate-45" />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
    </div>
  );
} 