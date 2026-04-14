import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapsuleStore } from '../store/useCapsuleStore';
import ImageUploader from '../components/ImageUploader';
import AudioRecorder from '../components/AudioRecorder';
import { ArrowLeft, Palette, Users, Lock, Tag, Calendar, Globe, CheckCircle2, XCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { validateContent, validateOpenDate } from '../utils/validation';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { templates, campusTags, Template } from '../utils/templates';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

type Step = 1 | 2 | 3 | 4 | 5;

export default function CreateCapsule() {
  const navigate = useNavigate();
  const { addCapsule, currentUser } = useCapsuleStore();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [openDate, setOpenDate] = useState<string>('');
  const [isPublic, setIsPublic] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [password, setPassword] = useState('');
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [sharedInput, setSharedInput] = useState('');
  const [blindBoxDescription, setBlindBoxDescription] = useState('');
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

    if (!isPublic && password && (password.length < 4 || password.length > 6)) {
      newErrors.push('密码长度应在4-6位之间');
    }

    if (sharedWith.length > 5) {
      newErrors.push('最多只能邀请5位好友');
    }

    if (isPublic && blindBoxDescription.length > 20) {
      newErrors.push('盲盒描述不能超过20字');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    addCapsule({
      userId: currentUser.id,
      content,
      images,
      audio,
      openAt: openDate,
      isPublic,
      isAnonymous,
      tags: selectedTags,
      template: selectedTemplate?.id,
      backgroundImage: selectedTemplate?.backgroundImage,
      fontStyle: selectedTemplate?.fontStyle.color,
      password: password || undefined,
      sharedWith: sharedWith.length > 0 ? sharedWith : undefined,
      blindBoxDescription: isPublic && blindBoxDescription ? blindBoxDescription : undefined
    });

    navigate('/my-capsules', { replace: true });
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setContent(template.placeholder);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else if (prev.length < 3) {
        return [...prev, tag];
      }
      return prev;
    });
  };

  const handleAddSharedUser = () => {
    if (sharedInput.trim() && sharedWith.length < 5 && !sharedWith.includes(sharedInput.trim())) {
      setSharedWith([...sharedWith, sharedInput.trim()]);
      setSharedInput('');
    }
  };

  const handleRemoveSharedUser = (user: string) => {
    setSharedWith(sharedWith.filter(u => u !== user));
  };

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const steps = [
    { id: 1 as Step, title: '选择模板', subtitle: '快速创建专属胶囊' },
    { id: 2 as Step, title: '记录回忆', subtitle: '写下故事，添加照片和语音' },
    { id: 3 as Step, title: '设置时间', subtitle: '选择胶囊开启的日期' },
    { id: 4 as Step, title: '添加标签', subtitle: '选择校园标签' },
    { id: 5 as Step, title: '隐私设置', subtitle: '选择可见性和匿名选项' },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1 as Step));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1 as Step));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] pb-32">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-[#e0d6f0]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-[#8a7ab5]" />
          </button>
          <h1 className="font-bold text-lg text-[#5a4b7a]">创建时光胶囊</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-[#fdecea] border border-[#fcd5ce] rounded-2xl">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-[#e57373] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-[#c62828] mb-1">请检查以下问题：</p>
                <ul className="text-sm text-[#d32f2f] space-y-1">
                  {errors.map((err, idx) => (
                    <li key={idx}>• {err}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 步骤指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-bold text-[#5a4b7a]">{steps[currentStep - 1].title}</h2>
              <p className="text-sm text-[#a093c2]">{steps[currentStep - 1].subtitle}</p>
            </div>
            <span className="text-sm text-[#c8b6e2]">{currentStep}/5</span>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1">
                <div className={cn(
                  "w-full h-2 rounded-full transition-all duration-300",
                  currentStep >= step.id ? "bg-[#c8b6e2]" : "bg-[#e0d6f0]"
                )} />
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 步骤 1：选择模板 */}
          {currentStep === 1 && (
            <Section title="选择模板" subtitle="快速创建专属胶囊">
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateSelect(template)}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all",
                      selectedTemplate?.id === template.id
                        ? "border-[#c8b6e2] bg-[#f5f3f7]"
                        : "border-[#e0d6f0] bg-white hover:border-[#c8b6e2]"
                    )}
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-2">
                      <img 
                        src={template.backgroundImage} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-sm text-[#5a4b7a]">{template.name}</h3>
                    <p className="text-xs text-[#a093c2]">{template.description}</p>
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* 步骤 2：记录回忆 */}
          {currentStep === 2 && (
            <>
              <Section title="写下你的故事" subtitle="记录此刻的心情">
                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="请输入回忆内容..."
                    style={{
                      color: selectedTemplate?.fontStyle.color,
                      fontFamily: selectedTemplate?.fontStyle.fontFamily
                    }}
                    className="w-full min-h-[150px] bg-white border border-[#e0d6f0] rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-[#c8b6e2] transition-all"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-[#a093c2]">
                    {content.length}/500
                  </div>
                </div>
                {isPublic && (
                  <input
                    type="text"
                    value={blindBoxDescription}
                    onChange={(e) => setBlindBoxDescription(e.target.value)}
                    placeholder="盲盒简介（10-20字）"
                    className="w-full mt-3 bg-white border border-[#e0d6f0] rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-[#c8b6e2] transition-all"
                  />
                )}
              </Section>

              <Section title="添加照片" subtitle="留下此刻的画面">
                <p className="text-sm text-[#a093c2] mb-3">请上传1张或多张照片</p>
                <ImageUploader images={images} onChange={setImages} />
              </Section>

              <Section title="语音留言" subtitle="让声音穿越时空（可选）">
                <AudioRecorder audioUrl={audio} onChange={setAudio} />
              </Section>
            </>
          )}

          {/* 步骤 3：设置时间 */}
          {currentStep === 3 && (
            <Section title="开启时间" subtitle="选择胶囊开启的日期">
              <p className="text-sm text-[#a093c2] mb-3">请选择1天后至1年内的任意时间</p>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a093c2]" />
                <input
                  type="datetime-local"
                  value={openDate}
                  onChange={(e) => setOpenDate(e.target.value)}
                  min={minDate.toISOString().slice(0, 16)}
                  max={maxDate.toISOString().slice(0, 16)}
                  className="w-full bg-white border border-[#e0d6f0] rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-[#c8b6e2] transition-all"
                />
              </div>
            </Section>
          )}

          {/* 步骤 4：添加标签 */}
          {currentStep === 4 && (
            <Section title="校园标签" subtitle="选择1-3个校园标签">
              <p className="text-sm text-[#a093c2] mb-3">选择与你的回忆相关的标签</p>
              <div className="flex flex-wrap gap-2">
                {campusTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-all",
                      selectedTags.includes(tag)
                        ? "bg-[#f5f3f7] text-[#8a7ab5] border border-[#c8b6e2]"
                        : "bg-white text-[#8a7ab5] border border-[#e0d6f0] hover:border-[#c8b6e2]"
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* 步骤 5：隐私设置 */}
          {currentStep === 5 && (
            <>
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

                {!isPublic && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-[#5a4b7a] mb-2">胶囊密码（可选）</h3>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="设置4-6位数字密码"
                        className="w-full bg-white border border-[#e0d6f0] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-[#c8b6e2] transition-all"
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-[#5a4b7a] mb-2">指定好友可见（可选）</h3>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={sharedInput}
                          onChange={(e) => setSharedInput(e.target.value)}
                          placeholder="输入好友昵称"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSharedUser()}
                          className="flex-1 bg-white border border-[#e0d6f0] rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-[#c8b6e2] transition-all"
                        />
                        <button
                          type="button"
                          onClick={handleAddSharedUser}
                          className="px-4 py-2.5 bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] text-[#5a4b7a] rounded-2xl hover:from-[#d8cbf0] hover:to-[#c8e0d3] transition-colors"
                        >
                          添加
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sharedWith.map((user, index) => (
                          <div key={index} className="flex items-center gap-1 bg-[#f5f3f7] rounded-full px-3 py-1 text-sm">
                            <span className="text-[#5a4b7a]">{user}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSharedUser(user)}
                              className="text-[#a093c2] hover:text-[#8a7ab5]"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-[#a093c2] mt-1">最多邀请5位好友</p>
                    </div>
                  </div>
                )}
              </Section>

              <Section title="匿名发布" subtitle="隐藏您的身份">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#e0d6f0]">
                  <div>
                    <p className="font-medium text-[#5a4b7a]">匿名发布</p>
                    <p className="text-xs text-[#a093c2]">其他用户无法看到您的昵称</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={cn(
                      "w-12 h-7 rounded-full transition-colors relative",
                      isAnonymous ? "bg-[#c8b6e2]" : "bg-[#e0d6f0]"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                      isAnonymous ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>
              </Section>
            </>
          )}

          {/* 步骤导航按钮 */}
          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl transition-all",
                currentStep === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-white border border-[#e0d6f0] text-[#5a4b7a] hover:border-[#c8b6e2]"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
              上一步
            </button>
            
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] text-[#5a4b7a] rounded-2xl hover:from-[#d8cbf0] hover:to-[#c8e0d3] transition-colors"
              >
                下一步
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-br from-[#e8dff5] to-[#d8f0e3] text-[#5a4b7a] font-bold rounded-2xl shadow-lg shadow-[#e8dff5]/50 active:scale-[0.98] transition-transform"
              >
                封印时光胶囊 ✨
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-bold text-[#5a4b7a] flex items-center gap-2">
          <span className="w-1.5 h-5 bg-gradient-to-b from-[#c8b6e2] to-[#a093c2] rounded-full" />
          {title}
        </h2>
        <p className="text-sm text-[#a093c2] ml-3.5">{subtitle}</p>
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
          ? "border-[#c8b6e2] bg-[#f5f3f7]" 
          : "border-[#e0d6f0] bg-white hover:border-[#c8b6e2]"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        active ? "bg-[#c8b6e2] text-white" : "bg-[#f5f3f7] text-[#a093c2]"
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <p className={cn("font-medium", active ? "text-[#5a4b7a]" : "text-[#8a7ab5]")}>
          {title}
        </p>
        <p className="text-xs text-[#a093c2]">{description}</p>
      </div>
      {active && <CheckCircle2 className="w-5 h-5 text-[#c8b6e2]" />}
    </button>
  );
}
