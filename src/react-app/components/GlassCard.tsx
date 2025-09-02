import { ReactNode, HTMLAttributes, forwardRef } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
  glow?: boolean;
  hover?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({ 
  children, 
  className = "", 
  blur = "lg",
  opacity = 0.1,
  glow = false,
  hover = false,
  ...props
}, ref) => {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md", 
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl"
  };

  const glowEffect = glow ? "shadow-2xl shadow-gray-500/10" : "shadow-lg shadow-gray-500/5";
  const hoverEffect = hover ? "hover:scale-[1.02] hover:shadow-2xl transition-all duration-500" : "";

  return (
    <div 
      {...props}
      ref={ref}
      className={`
        ${blurClasses[blur]} 
        border border-gray-200/50 
        rounded-3xl 
        ${glowEffect}
        ${hoverEffect}
        ${className}
      `}
      style={{
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: `blur(${blur === 'sm' ? '4px' : blur === 'md' ? '12px' : blur === 'lg' ? '16px' : '24px'})`,
        WebkitBackdropFilter: `blur(${blur === 'sm' ? '4px' : blur === 'md' ? '12px' : blur === 'lg' ? '16px' : '24px'})`,
        ...props.style,
      }}
    >
      {children}
    </div>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
