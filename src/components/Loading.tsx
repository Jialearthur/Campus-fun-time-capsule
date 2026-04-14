import { Sparkles, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface LoadingProps {
  type?: 'hourglass' | 'capsule' | 'sparkles';
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export default function Loading({ 
  type = 'sparkles', 
  size = 'medium', 
  text,
  className 
}: LoadingProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const textClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      {type === 'hourglass' && (
        <div className={cn('relative', sizeClasses[size])}>
          <div className="absolute inset-0 border-4 border-[#e0d6f0] rounded-full"></div>
          <div className="absolute inset-2 border-4 border-[#c8b6e2] rounded-full animate-spin-slow"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Clock className="w-1/2 h-1/2 text-[#8a7ab5]" />
          </div>
        </div>
      )}

      {type === 'capsule' && (
        <div className={cn('relative', sizeClasses[size])}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#e8dff5] to-[#d8f0e3] rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <div className="w-3/4 h-1/2 bg-gradient-to-r from-[#c8b6e2] to-[#a093c2] rounded-full animate-bounce"></div>
          </div>
        </div>
      )}

      {type === 'sparkles' && (
        <div className={cn('flex items-center justify-center', sizeClasses[size])}>
          <Sparkles className="w-full h-full text-[#c8b6e2] animate-pulse" />
        </div>
      )}

      {text && (
        <p className={cn('text-[#8a7ab5] font-medium', textClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
}
