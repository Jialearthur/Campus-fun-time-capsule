import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapsuleStore } from '../store/useCapsuleStore';
import { ArrowLeft, MapPin, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function CampusMap() {
  const navigate = useNavigate();
  const { landmarks, getCapsulesByLandmark, getPublicCapsules } = useCapsuleStore();
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null);
  const [landmarkCapsules, setLandmarkCapsules] = useState<any[]>([]);

  useEffect(() => {
    if (selectedLandmark) {
      const capsules = getCapsulesByLandmark(selectedLandmark);
      setLandmarkCapsules(capsules);
    }
  }, [selectedLandmark, getCapsulesByLandmark]);

  const handleLandmarkSelect = (landmarkId: string) => {
    setSelectedLandmark(landmarkId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] pb-32">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-[#e0d6f0]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-[#8a7ab5]" />
          </button>
          <h1 className="font-bold text-lg text-[#5a4b7a]">校园时光地图</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="mb-8">
          <h2 className="font-bold text-xl text-[#5a4b7a] mb-2">校园地标</h2>
          <p className="text-sm text-[#a093c2]">探索校园里的时光胶囊，重温那些美好的回忆</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {landmarks.map((landmark) => {
            const capsules = getCapsulesByLandmark(landmark.id);
            return (
              <button
                key={landmark.id}
                onClick={() => handleLandmarkSelect(landmark.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center",
                  selectedLandmark === landmark.id
                    ? "border-candy-pink bg-candy-pink/10"
                    : "border-[#e0d6f0] bg-white hover:border-candy-pink"
                )}
              >
                <span className="text-3xl mb-2">{landmark.icon}</span>
                <h3 className="font-medium text-sm text-[#5a4b7a]">{landmark.name}</h3>
                <p className="text-xs text-[#a093c2] mt-1">{landmark.description}</p>
                <span className="mt-2 text-xs bg-gradient-to-r from-candy-pink/20 to-candy-purple/20 text-candy-purple px-2 py-1 rounded-full">
                  {capsules.length} 个胶囊
                </span>
              </button>
            );
          })}
        </div>

        {selectedLandmark && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#5a4b7a]">
                {landmarks.find(l => l.id === selectedLandmark)?.name} 的胶囊
              </h3>
              <span className="text-sm text-[#a093c2]">{landmarkCapsules.length} 个</span>
            </div>
            
            {landmarkCapsules.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl border border-[#e0d6f0]">
                <p className="text-[#a093c2]">这里还没有胶囊，快来创建第一个吧！</p>
              </div>
            ) : (
              <div className="space-y-4">
                {landmarkCapsules.map((capsule) => (
                  <div
                    key={capsule.id}
                    className="bg-white rounded-2xl p-4 border border-[#e0d6f0] cursor-pointer hover:border-candy-pink transition-all"
                    onClick={() => navigate(`/capsule/${capsule.id}`)}
                  >
                    <div className="flex items-start gap-3">
                      {capsule.images.length > 0 && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={capsule.images[0]} alt="胶囊封面" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-[#5a4b7a] mb-1">
                          {capsule.content.substring(0, 20)}...
                        </h4>
                        <p className="text-xs text-[#a093c2] mb-2">
                          {new Date(capsule.createdAt).toLocaleDateString('zh-CN')}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-candy-green/20 text-candy-green px-2 py-0.5 rounded-full">
                            {capsule.isPublic ? '公开' : '私密'}
                          </span>
                          <span className="text-xs bg-candy-purple/20 text-candy-purple px-2 py-0.5 rounded-full">
                            {capsule.likes} 喜欢
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#a093c2] flex-shrink-0 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-gradient-to-r from-candy-pink/10 to-candy-purple/10 rounded-2xl p-4 border border-candy-pink/20 mb-8">
          <h3 className="font-medium text-[#5a4b7a] mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-candy-purple" />
            扫码查看
          </h3>
          <p className="text-sm text-[#a093c2]">
            在对应地标附近扫码，即可查看该地点的所有公开胶囊，体验沉浸式校园回忆
          </p>
        </div>
      </div>
    </div>
  );
}
