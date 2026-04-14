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
}

export default function CountdownTimer({ openAt, showLabel = true, className }: CountdownTimerProps) {
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
      <div className={cn("flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit", className)}>
        <Unlock className="w-4 h-4" />
        <span className="text-sm font-medium">已开启</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex items-center gap-1.5 mb-1">
        <Lock className="w-3.5 h-3.5 text-purple-400" />
        {showLabel && <span className="text-xs text-gray-500">开启倒计时</span>}
      </div>
      
      <div className="flex items-center gap-2">
        <TimeBlock value={timeLeft.days} label="天" />
        <span className="text-pink-400 font-bold text-lg">:</span>
        <TimeBlock value={timeLeft.hours} label="时" />
        <span className="text-pink-400 font-bold text-lg">:</span>
        <TimeBlock value={timeLeft.minutes} label="分" />
        <span className="text-pink-400 font-bold text-lg">::</span>
        <TimeBlock value={timeLeft.seconds} label="秒" />
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-8 h-10 rounded-lg flex items-center justify-center shadow-sm shadow-pink-200">
        <span className="text-white font-bold text-sm leading-none">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] text-gray-400 mt-1">{label}</span>
    </div>
  );
}
