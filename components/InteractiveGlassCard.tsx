import { ReactNode, HTMLAttributes, forwardRef, useState, useRef } from "react";
import GlassCard from "./GlassCard";

interface InteractiveGlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
  enableRipple?: boolean;
  enableMouseTrack?: boolean;
}

const InteractiveGlassCard = forwardRef<HTMLDivElement, InteractiveGlassCardProps>(({ 
  children, 
  className = "",
  blur = "lg",
  opacity = 0.1,
  enableRipple = true,
  enableMouseTrack = true,
  onClick,
  onMouseMove,
  ...props
}, ref) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (enableRipple) {
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const newRipple = { id: ++rippleId.current, x, y };
        setRipples(prev => [...prev, newRipple]);
        
        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 2000);
      }
    }
    
    onClick?.(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (enableMouseTrack) {
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    }
    
    onMouseMove?.(e);
  };

  return (
    <GlassCard
      {...props}
      ref={(node) => {
        cardRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      blur={blur}
      opacity={opacity}
      className={`
        ${className}
        interactive-glass-card
        relative overflow-hidden cursor-pointer
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-2xl
      `}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`,
      } as React.CSSProperties}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
    >
      {/* Mouse tracking gradient overlay */}
      {enableMouseTrack && (
        <div 
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(139, 92, 246, 0.1) 0%, 
              rgba(99, 102, 241, 0.05) 30%, 
              transparent 60%)`,
          }}
        />
      )}

      {/* Ripple container */}
      {enableRipple && (
        <div className="ripple-container">
          {ripples.map(ripple => (
            <div
              key={ripple.id}
              className="ripple-effect"
              style={{
                left: `${ripple.x}%`,
                top: `${ripple.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </GlassCard>
  );
});

InteractiveGlassCard.displayName = 'InteractiveGlassCard';

export default InteractiveGlassCard;
