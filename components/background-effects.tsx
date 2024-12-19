export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-background to-purple-50/50 dark:from-blue-950/50 dark:via-background dark:to-purple-950/50" />
      
      {/* Grid pattern with more contrast */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Larger color accents */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ transform: 'translate(-50%, -25%)' }}
        />
        <div 
          className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ transform: 'translate(50%, 25%)' }}
        />
      </div>
    </div>
  );
} 