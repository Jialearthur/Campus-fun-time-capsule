import { useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import { Notification } from '../types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface NotificationCenterProps {
  isDark?: boolean;
}

export default function NotificationCenter({ isDark = false }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationAsRead, wechatBound, bindWechat } = useCapsuleStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 -mr-2"
      >
        <Bell className={cn(
          "w-6 h-6",
          isDark ? "text-dark-text-secondary" : "text-gray-600"
        )} />
        {unreadCount > 0 && (
          <span className={cn(
            "absolute top-1 right-1 w-2 h-2 rounded-full",
            isDark ? "bg-dark-accent-secondary" : "bg-pink-500"
          )} />
        )}
      </button>

      {isOpen && (
        <div className={cn(
          "absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-lg border z-50",
          isDark
            ? "bg-dark-bg-secondary border-dark-border-primary shadow-dark"
            : "bg-white border-gray-100"
        )}>
          <div className={cn(
            "p-4 border-b",
            isDark ? "border-dark-border-primary" : "border-gray-100"
          )}>
            <h3 className={cn(
              "font-bold",
              isDark ? "text-dark-text-primary" : "text-gray-800"
            )}>通知中心</h3>
            {wechatBound ? (
              <p className={cn(
                "text-xs flex items-center gap-1 mt-1",
                isDark ? "text-dark-accent-secondary" : "text-green-600"
              )}>
                <CheckCircle2 className="w-3 h-3" />
                微信已绑定
              </p>
            ) : (
              <button
                onClick={bindWechat}
                className={cn(
                  "text-xs mt-1 inline-block",
                  isDark ? "text-dark-accent-secondary" : "text-pink-500"
                )}
              >
                绑定微信接收提醒
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className={cn(
                  "text-xs",
                  isDark ? "text-dark-text-tertiary" : "text-gray-400"
                )}>暂无通知</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markNotificationAsRead(notification.id)}
                  className={cn(
                    "p-4 border-b cursor-pointer transition-colors",
                    isDark
                      ? [
                          "border-dark-border-primary hover:bg-dark-bg-tertiary",
                          !notification.read && "bg-dark-bg-tertiary"
                        ]
                      : [
                          "border-gray-50 hover:bg-gray-50",
                          !notification.read && "bg-pink-50"
                        ]
                  )}
                >
                  <p className={cn(
                    "font-medium",
                    isDark ? "text-dark-text-primary" : "text-gray-800"
                  )}>{notification.title}</p>
                  <p className={cn(
                    "text-sm mt-1",
                    isDark ? "text-dark-text-secondary" : "text-gray-500"
                  )}>{notification.message}</p>
                  <p className={cn(
                    "text-xs mt-2",
                    isDark ? "text-dark-text-tertiary" : "text-gray-400"
                  )}>
                    {new Date(notification.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
