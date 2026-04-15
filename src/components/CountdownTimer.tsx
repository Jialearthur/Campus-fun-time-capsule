import { useState, useEffect } from 'react';
import { Clock, Lock, Unlock } from 'lucide-react';
import { formatCountdown, isCapsuleOpened } from '../utils/date';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface CountdownTimerProps {
  openAt: string;
  showLabel?: boolean;
  className?: string;
  isDark?: boolean;
}

export default function CountdownTimer({ openAt, showLabel = true, className, isDark = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(formatCountdown(openAt));
  const isOpened = isCapsuleOpened(openAt);

  useEffect(() => {
    if (isOpened) return;

    const timer = setInterval(() => {
      setTimeLeft(formatCountdown(openAt));
    }, 1000);

    return () => clearInterval(timer);
  }, [openAt, isOpened]);

  if (isOpened) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full w-fit",
        isDark
          ? "text-dark-accent-secondary bg-dark-bg-tertiary"
          : "text-green-600 bg-green-50",
        className
      )}>
        <Unlock className={cn(
          "w-4 h-4",
          isDark ? "text-dark-accent-secondary" : "text-green-600"
        )} />
        <span className={cn(
          "text-sm font-medium",
          isDark ? "text-dark-text-primary" : "text-green-600"
        )}>已开启</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex items-center gap-1.5 mb-1">
        <Lock className={cn(
          "w-3.5 h-3.5",
          isDark ? "text-dark-accent-secondary" : "text-purple-400"
        )} />
        {showLabel && <span className={cn(
          "text-xs",
          isDark ? "text-dark-text-tertiary" : "text-gray-500"
        )}>开启倒计时</span>}
      </div>
      
      <div className="flex items-center gap-2">
        <TimeBlock value={timeLeft.days} label="天" isDark={isDark} />
        <span className={cn(
          "font-bold text-lg",
          isDark ? "text-dark-accent-secondary" : "text-pink-400"
        )}>:</span>
        <TimeBlock value={timeLeft.hours} label="时" isDark={isDark} />
        <span className={cn(
          "font-bold text-lg",
          isDark ? "text-dark-accent-secondary" : "text-pink-400"
        )}>:</span>
        <TimeBlock value={timeLeft.minutes} label="分" isDark={isDark} />
        <span className={cn(
          "font-bold text-lg",
          isDark ? "text-dark-accent-secondary" : "text-pink-400"
        )}>::</span>
        <TimeBlock value={timeLeft.seconds} label="秒" isDark={isDark} />
      </div>
    </div>
  );
}

function TimeBlock({ value, label, isDark = false }: { value: number; label: string; isDark?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "w-8 h-10 rounded-lg flex items-center justify-center shadow-sm",
        isDark
          ? "bg-gradient-to-br from-dark-accent-primary to-dark-accent-secondary"
          : "bg-gradient-to-br from-pink-500 to-purple-600 shadow-pink-200"
      )}>
        <span className="text-white font-bold text-sm leading-none">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className={cn(
        "text-[10px] mt-1",
        isDark ? "text-dark-text-tertiary" : "text-gray-400"
      )}>{label}</span>
    </div>
  );
}
