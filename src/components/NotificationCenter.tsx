import { useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useCapsuleStore } from '../store/useCapsuleStore';
import { Notification } from '../types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationAsRead, wechatBound, bindWechat } = useCapsuleStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 -mr-2"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 z-50">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">通知中心</h3>
            {wechatBound ? (
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                微信已绑定
              </p>
            ) : (
              <button
                onClick={bindWechat}
                className="text-xs text-pink-500 mt-1 inline-block"
              >
                绑定微信接收提醒
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400">暂无通知</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markNotificationAsRead(notification.id)}
                  className={cn(
                    "p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors",
                    !notification.read && "bg-pink-50"
                  )}
                >
                  <p className="font-medium text-gray-800">{notification.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
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
