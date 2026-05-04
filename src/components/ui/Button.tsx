"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-sans font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-primary text-cream hover:bg-primary-container shadow-[0_2px_0_0_rgba(21,66,18,0.2)]",
      secondary: "bg-secondary text-cream hover:bg-secondary-container shadow-[0_2px_0_0_rgba(152,71,33,0.2)]",
      outline: "border-2 border-terracotta text-terracotta hover:bg-terracotta/10",
      ghost: "hover:bg-surface-dim text-foreground",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-8 text-base",
      lg: "h-14 px-10 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ y: 1 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children as any}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
