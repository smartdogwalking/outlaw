import { ReactNode, HTMLAttributes, forwardRef, useState } from "react";
import GlassCard from "./GlassCard";

interface HeroGlassRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
}

const HeroGlassReveal = forwardRef<HTMLDivElement, HeroGlassRevealProps>(({ 
  children, 
  className = "", 
  blur = "xl",
  opacity = 0.08,
  ...props
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <GlassCard
      {...props}
      ref={ref}
      blur={blur}
      opacity={opacity}
      className={`
        ${className}
        transition-all duration-700 ease-out
        ${isHovered ? 'scale-[1.02] shadow-2xl shadow-gray-500/20' : 'shadow-xl shadow-gray-500/10'}
        hover:border-gray-300/50
        relative overflow-hidden
        group
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle gradient overlay that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle border glow effect */}
      <div className="absolute inset-0 rounded-3xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </GlassCard>
  );
});

HeroGlassReveal.displayName = 'HeroGlassReveal';

export default HeroGlassReveal;
