"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={interactive ? { y: -4, transition: { duration: 0.2 } } : {}}
        className={cn(
          "rounded-[1.5rem] bg-white border border-surface-dim shadow-[0_4px_12px_rgba(45,90,39,0.05)] overflow-hidden",
          interactive && "cursor-pointer hover:shadow-[0_8px_24px_rgba(152,71,33,0.08)]",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";
