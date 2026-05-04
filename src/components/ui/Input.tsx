import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold tracking-wide text-foreground">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-4 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "flex h-12 w-full rounded-lg border bg-white py-2 text-sm text-foreground placeholder:text-surface-dim",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon ? "pl-11 pr-4" : "px-4",
              error ? "border-red-500 focus:ring-red-500" : "border-[#c2c9bb]",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
