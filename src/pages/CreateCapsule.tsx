import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapsuleStore } from '../store/useCapsuleStore';
import ImageUploader from '../components/ImageUploader';
import AudioRecorder from '../components/AudioRecorder';
import { ArrowLeft, Calendar, Globe, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { validateContent, validateOpenDate } from '../utils/validation';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function CreateCapsule() {
  const navigate = useNavigate();
  const { addCapsule, currentUser } = useCapsuleStore();

  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [openDate, setOpenDate] = useState<string>('');
  const [isPublic, setIsPublic] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    const newErrors: string[] = [];
    
    const contentValidation = validateContent(content);
    if (!contentValidation.valid) {
      newErrors.push(contentValidation.message!);
    }

    if (!openDate) {
      newErrors.push('请选择开启时间');
    } else {
      const dateValidation = validateOpenDate(new Date(openDate));
      if (!dateValidation.valid) {
        newErrors.push(dateValidation.message!);
      }
    }

    if (images.length === 0) {
      newErrors.push('请至少上传1张图片');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const tags = tagsInput.split(/[,，\s]+/).filter(t => t.trim());

    addCapsule({
      userId: currentUser.id,
      content,
      images,
      audio,
      openAt: openDate,
      isPublic,
      isAnonymous,
      tags
    });

    navigate('/my', { replace: true });
  };

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 pb-32">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-pink-100">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="font-bold text-lg text-gray-800">创建时光胶囊</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-700 mb-1">请检查以下问题：</p>
                <ul className="text-sm text-red-600 space-y-1">
                  {errors.map((err, idx) => (
                    <li key={idx}>• {err}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Section title="写下你的故事" subtitle="记录此刻的心情">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="想对未来的自己说些什么..."
                className="w-full min-h-[150px] bg-white border border-gray-200 rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {content.length}/500
              </div>
            </div>
          </Section>

          <Section title="添加照片" subtitle="留下此刻的画面">
            <ImageUploader images={images} onChange={setImages} />
          </Section>

          <Section title="语音留言" subtitle="让声音穿越时空（可选）">
            <AudioRecorder audioUrl={audio} onChange={setAudio} />
          </Section>

          <Section title="开启时间" subtitle="选择胶囊开启的日期">
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="datetime-local"
                value={openDate}
                onChange={(e) => setOpenDate(e.target.value)}
                min={minDate.toISOString().slice(0, 16)}
                max={maxDate.toISOString().slice(0, 16)}
                className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              可选择 1 天后至 1 年内的任意时间
            </p>
          </Section>

          <Section title="标签" subtitle="用标签分类你的胶囊（可选）">
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="用逗号或空格分隔，如：学习 朋友 青春"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all"
            />
          </Section>

          <Section title="隐私设置" subtitle="选择胶囊的可见性">
            <div className="space-y-3">
              <ToggleButton
                active={isPublic}
                onClick={() => setIsPublic(true)}
                icon={<Globe className="w-5 h-5" />}
                title="公开"
                description="展示在胶囊广场，所有用户可见"
              />
              <ToggleButton
                active={!isPublic}
                onClick={() => setIsPublic(false)}
                icon={<Lock className="w-5 h-5" />}
                title="私密"
                description="仅您本人可见"
              />
            </div>
          </Section>

          <Section title="匿名发布" subtitle="隐藏您的身份">
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">匿名发布</p>
                <p className="text-xs text-gray-500">其他用户无法看到您的昵称</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative",
                  isAnonymous ? "bg-pink-500" : "bg-gray-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                  isAnonymous ? "left-6" : "left-1"
                )} />
              </button>
            </div>
          </Section>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 active:scale-[0.98] transition-transform"
          >
            封印时光胶囊 ✨
          </button>
        </form>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full" />
          {title}
        </h2>
        <p className="text-sm text-gray-500 ml-3.5">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function ToggleButton({ active, onClick, icon, title, description }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; description: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-3 text-left",
        active 
          ? "border-pink-400 bg-pink-50" 
          : "border-gray-200 bg-white hover:border-gray-300"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        active ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-400"
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <p className={cn("font-medium", active ? "text-gray-900" : "text-gray-700")}>
          {title}
        </p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {active && <CheckCircle2 className="w-5 h-5 text-pink-500" />}
    </button>
  );
}
