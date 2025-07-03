import React from 'react';
import { cn } from '@/lib/utils';

const Badge = ({ 
  className, 
  variant = 'default',
  children,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold';
  
  const variantClasses = {
    default: 'bg-green-100 text-green-800 border-transparent',
    secondary: 'bg-blue-100 text-blue-800 border-transparent',
    destructive: 'bg-red-100 text-red-800 border-transparent',
    warning: 'bg-yellow-100 text-yellow-800 border-transparent',
    outline: 'bg-transparent border-gray-300 text-gray-700',
  };

  return (
    <span 
      className={cn(
        baseClasses,
        variantClasses[variant] || variantClasses.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };
