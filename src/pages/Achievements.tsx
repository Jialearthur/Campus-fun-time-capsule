import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapsuleStore } from '../store/useCapsuleStore';
import { ArrowLeft, Award, Star, Trophy, Heart, Users, MessageCircle, Share2, Calendar, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../hooks/useTheme';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function Achievements() {
  const navigate = useNavigate();
  const { currentUser, getAchievements } = useCapsuleStore();
  const { isDark } = useTheme();
  
  // 直接获取最新的成就列表，确保实时更新
  const achievements = currentUser ? getAchievements(currentUser.id) : [];

  const getAchievementIcon = (id: string) => {
    switch (id) {
      case 'first_capsule':
        return <Star className="w-6 h-6" />;
      case 'ten_capsules':
        return <Trophy className="w-6 h-6" />;
      case 'ten_likes':
        return <Heart className="w-6 h-6" />;
      case 'group_capsule':
        return <Users className="w-6 h-6" />;
      case 'cross_reply':
        return <MessageCircle className="w-6 h-6" />;
      case 'share_poster':
        return <Share2 className="w-6 h-6" />;
      case 'ten_drift_bottles':
        return <MessageSquare className="w-6 h-6" />;
      case 'bind_anniversary':
        return <Calendar className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div className={cn(
      "min-h-screen pb-32 transition-colors duration-300",
      isDark 
        ? "bg-dark-bg-primary text-dark-text-primary"
        : "bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7]"
    )}>
      <div className={cn(
        "sticky top-0 backdrop-blur-md z-40 border-b",
        isDark
          ? "bg-dark-bg-secondary/80 border-dark-border-primary"
          : "bg-white/80 border-[#e0d6f0]"
      )}>
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className={cn(
              "w-6 h-6",
              isDark ? "text-dark-text-secondary" : "text-[#8a7ab5]"
            )} />
          </button>
          <h1 className={cn(
            "font-bold text-lg",
            isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
          )}>成就系统</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="mb-8 text-center">
          <Award className={cn(
            "w-16 h-16 mx-auto mb-4",
            isDark ? "text-dark-accent-secondary" : "text-candy-yellow"
          )} />
          <h2 className={cn(
            "font-bold text-xl mb-2",
            isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
          )}>我的成就</h2>
          <p className={cn(
            "text-sm",
            isDark ? "text-dark-text-secondary" : "text-[#a093c2]"
          )}>
            解锁成就，获得额外盲盒开启机会
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {achievements.map((achievement) => (
            <div key={achievement.id} className={cn(
              "rounded-2xl p-4 border-2 transition-all",
              isDark
                ? achievement.unlocked 
                  ? "border-dark-accent-secondary bg-dark-bg-tertiary" 
                  : "border-dark-border-primary bg-dark-bg-secondary"
                : achievement.unlocked 
                  ? "border-candy-yellow bg-candy-yellow/5" 
                  : "border-[#e0d6f0] bg-gray-50"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-3",
                achievement.unlocked 
                  ? (isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary text-white" : "bg-gradient-to-r from-candy-yellow to-candy-orange text-white") 
                  : (isDark ? "bg-dark-bg-tertiary text-dark-text-tertiary" : "bg-gray-200 text-gray-400")
              )}>
                {getAchievementIcon(achievement.id)}
              </div>
              <h3 className={cn(
                "font-medium text-sm mb-1",
                achievement.unlocked 
                  ? (isDark ? "text-dark-text-primary" : "text-[#5a4b7a]") 
                  : (isDark ? "text-dark-text-tertiary" : "text-gray-400")
              )}>
                {achievement.name}
              </h3>
              <p className={cn(
                "text-xs mb-3",
                achievement.unlocked 
                  ? (isDark ? "text-dark-text-secondary" : "text-[#a093c2]") 
                  : (isDark ? "text-dark-text-tertiary" : "text-gray-300")
              )}>
                {achievement.description}
              </p>
              {achievement.unlocked && (
                <div className={cn(
                  "text-xs",
                  isDark ? "text-dark-accent-secondary" : "text-candy-green"
                )}>
                  已解锁
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={cn(
          "rounded-2xl p-4 border mb-8",
          isDark
            ? "bg-dark-bg-secondary border-dark-border-primary"
            : "bg-gradient-to-r from-candy-yellow/10 to-candy-orange/10 border border-candy-yellow/20"
        )}>
          <h3 className={cn(
            "font-medium mb-2 flex items-center gap-2",
            isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
          )}>
            <Award className={cn(
              "w-4 h-4",
              isDark ? "text-dark-accent-secondary" : "text-candy-yellow"
            )} />
            成就奖励
          </h3>
          <p className={cn(
            "text-sm mb-3",
            isDark ? "text-dark-text-secondary" : "text-[#a093c2]"
          )}>
            每解锁一个成就，你将获得1次额外的盲盒开启机会
          </p>
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-sm",
              isDark ? "text-dark-text-secondary" : "text-[#5a4b7a]"
            )}>已解锁成就</span>
            <span className={cn(
              "text-sm font-medium",
              isDark ? "text-dark-accent-secondary" : "text-candy-yellow"
            )}>
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </span>
          </div>
        </div>

        <div className={cn(
          "rounded-2xl p-4 border",
          isDark
            ? "bg-dark-bg-secondary border-dark-border-primary"
            : "bg-white border-[#e0d6f0]"
        )}>
          <h3 className={cn(
            "font-medium mb-3",
            isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
          )}>成就列表</h3>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    achievement.unlocked 
                      ? (isDark ? "bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary text-white" : "bg-gradient-to-r from-candy-yellow to-candy-orange text-white") 
                      : (isDark ? "bg-dark-bg-tertiary text-dark-text-tertiary" : "bg-gray-200 text-gray-400")
                  )}>
                    {getAchievementIcon(achievement.id)}
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-medium",
                      achievement.unlocked 
                        ? (isDark ? "text-dark-text-primary" : "text-[#5a4b7a]") 
                        : (isDark ? "text-dark-text-tertiary" : "text-gray-400")
                    )}>
                      {achievement.name}
                    </p>
                    <p className={cn(
                      "text-xs",
                      achievement.unlocked 
                        ? (isDark ? "text-dark-text-secondary" : "text-[#a093c2]") 
                        : (isDark ? "text-dark-text-tertiary" : "text-gray-300")
                    )}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
                {achievement.unlocked && (
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    isDark 
                      ? "bg-dark-accent-secondary/20 text-dark-accent-secondary"
                      : "bg-candy-green/20 text-candy-green"
                  )}>
                    已解锁
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
