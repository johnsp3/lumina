import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  // Base classes
  const baseClasses = 'font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-zinc-200 hover:bg-zinc-300 text-zinc-900 focus:ring-zinc-300',
    outline: 'border border-zinc-300 hover:bg-zinc-50 text-zinc-800 focus:ring-zinc-200',
    text: 'text-blue-500 hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-200'
  };
  
  // Combine all classes
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
} 