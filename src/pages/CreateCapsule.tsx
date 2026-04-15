import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapsuleStore } from '../store/useCapsuleStore';
import ImageUploader from '../components/ImageUploader';
import AudioRecorder from '../components/AudioRecorder';
import { useTheme } from '../hooks/useTheme';
import {
  ArrowLeft,
  Palette,
  Users,
  Lock,
  Tag,
  Calendar,
  Globe,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  RefreshCw,
  Copy,
  UserPlus,
  Save,
  Trash2,
  Clock
} from 'lucide-react';
import { validateContent, validateOpenDate } from '../utils/validation';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { templates, campusTags, Template, getAvailableLimitedTemplates } from '../utils/templates';
import {
  generateAITextTemplates,
  getStyleIcon,
  getStyleColor
} from '../utils/aiTextGenerator';
import { AITextTemplate } from '../types';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function CreateCapsule() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const {
    addCapsule,
    currentUser,
    saveDraft,
    getDrafts,
    deleteDraft,
    landmarks
  } = useCapsuleStore();

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

  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupMemberCount, setGroupMemberCount] = useState(5);
  const [inviteLink, setInviteLink] = useState('');
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string | null>(null);

  const [aiKeywords, setAiKeywords] = useState<string[]>([]);
  const [aiKeywordInput, setAiKeywordInput] = useState('');
  const [aiTemplates, setAiTemplates] = useState<AITextTemplate[]>([]);
  const [showAiSection, setShowAiSection] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newCapsuleId, setNewCapsuleId] = useState<string | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentUser) {
      const drafts = getDrafts(currentUser.id);
      if (drafts.length > 0) {
        setShowDraftPrompt(true);
      }
    }
  }, [currentUser, getDrafts]);

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    if (currentUser && (content || images.length > 0 || selectedTemplate)) {
      autoSaveTimerRef.current = setTimeout(() => {
        saveDraft({
          userId: currentUser.id,
          content,
          images,
          audio: audio || undefined,
          openAt: openDate || undefined,
          isPublic,
          isAnonymous,
          tags: selectedTags,
          template: selectedTemplate?.id,
          backgroundImage: selectedTemplate?.backgroundImage,
          fontStyle: selectedTemplate?.fontStyle.color,
          password: password || undefined,
          sharedWith: sharedWith.length > 0 ? sharedWith : undefined,
          isGroup,
          groupName: groupName || undefined,
          groupMembers: sharedWith.length > 0 ? sharedWith : undefined,
          landmarkId: selectedLandmarkId || undefined
        });
        setLastSavedAt(new Date());
      }, 30000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [
    content,
    images,
    audio,
    openDate,
    isPublic,
    isAnonymous,
    selectedTags,
    selectedTemplate,
    password,
    sharedWith,
    isGroup,
    groupName,
    currentUser,
    saveDraft
  ]);

  const loadDraft = (draft: any) => {
    setContent(draft.content || '');
    setImages(draft.images || []);
    setAudio(draft.audio || null);
    setOpenDate(draft.openAt || '');
    setIsPublic(draft.isPublic ?? true);
    setIsAnonymous(draft.isAnonymous ?? false);
    setSelectedTags(draft.tags || []);
    setPassword(draft.password || '');
    setSharedWith(draft.sharedWith || []);
    setIsGroup(draft.isGroup ?? false);
    setGroupName(draft.groupName || '');
    setSelectedLandmarkId(draft.landmarkId || null);
    setShowDraftPrompt(false);
  };

  const handleGenerateAiTemplates = () => {
    if (aiKeywords.length === 0) return;
    setIsGeneratingAi(true);
    setTimeout(() => {
      const templates = generateAITextTemplates(aiKeywords);
      setAiTemplates(templates);
      setIsGeneratingAi(false);
    }, 1000);
  };

  const handleAddAiKeyword = () => {
    if (aiKeywordInput.trim() && aiKeywords.length < 3) {
      setAiKeywords([...aiKeywords, aiKeywordInput.trim()]);
      setAiKeywordInput('');
    }
  };

  const handleRemoveAiKeyword = (keyword: string) => {
    setAiKeywords(aiKeywords.filter(k => k !== keyword));
  };

  const handleUseAiTemplate = (templateContent: string) => {
    setContent(templateContent);
    setShowAiSection(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    const newErrors: string[] = [];
    
    const contentValidation = validateContent(content);
    if (!contentValidation.valid) {
      newErrors.push(contentValidation.message!);
    }

    // 设置默认开启时间（如果用户未选择）
    let finalOpenDate = openDate;
    if (!finalOpenDate) {
      // 默认设置为7天后
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      finalOpenDate = defaultDate.toISOString().slice(0, 16);
    }
    
    // 验证开启时间
    const dateValidation = validateOpenDate(new Date(finalOpenDate));
    if (!dateValidation.valid) {
      newErrors.push(dateValidation.message!);
    }

    // 如果用户没有上传图片，使用默认的AI生成图片
    let finalImages = images;
    if (images.length === 0) {
      // 根据选择的地标或标签生成默认图片提示词
      let defaultImagePrompt = 'beautiful campus scenery with warm lighting, university campus';
      if (selectedLandmarkId) {
        const selectedLandmark = landmarks.find(l => l.id === selectedLandmarkId);
        if (selectedLandmark) {
          defaultImagePrompt = `${selectedLandmark.name} campus scenery, ${selectedLandmark.description}, university campus, warm lighting`;
        }
      } else if (selectedTags.length > 0) {
        defaultImagePrompt = `campus ${selectedTags.join(', ')}, university campus, warm lighting`;
      }
      finalImages = [`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(defaultImagePrompt)}&image_size=square`];
    }

    if (!isPublic && password && (password.length < 4 || password.length > 6)) {
      newErrors.push('密码长度应在4-6位之间');
    }

    if (sharedWith.length > 5 && !isGroup) {
      newErrors.push('最多只能邀请5位好友');
    }

    if (isGroup && sharedWith.length > 19) {
      newErrors.push('集体胶囊最多邀请19位成员');
    }

    if (isPublic && blindBoxDescription.length > 20) {
      newErrors.push('盲盒描述不能超过20字');
    }

    if (isGroup && !groupName) {
      newErrors.push('请输入集体胶囊名称');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const capsuleData: any = {
      userId: currentUser.id,
      content,
      images: finalImages,
      audio,
      openAt: finalOpenDate,
      isPublic,
      isAnonymous,
      tags: selectedTags,
      template: selectedTemplate?.id,
      backgroundImage: selectedTemplate?.backgroundImage,
      fontStyle: selectedTemplate?.fontStyle.color,
      password: password || undefined,
      sharedWith: sharedWith.length > 0 && !isGroup ? sharedWith : undefined,
      blindBoxDescription: isPublic && blindBoxDescription ? blindBoxDescription : undefined,
      landmarkId: selectedLandmarkId || undefined,
      isLimitedEdition: selectedTemplate?.isLimited || false,
      limitedEditionTheme: selectedTemplate?.limitedBadge || undefined
    };

    if (isGroup) {
      capsuleData.isGroup = true;
      capsuleData.groupName = groupName;
      capsuleData.inviteLink = `https://capsule.example.com/join/${Date.now()}`;
      capsuleData.groupMembers = [
        {
          id: currentUser.id,
          userId: currentUser.id,
          nickname: currentUser.nickname,
          avatar: currentUser.avatar,
          joinedAt: new Date().toISOString(),
          content: content,
          images: images.length > 0 ? images : undefined,
          audio: audio || undefined
        }
      ];
    }

    // 生成胶囊ID
    const capsuleId = Date.now().toString();
    
    // 生成邀请链接
    if (isGroup) {
      // 使用当前页面的域名，确保链接是可访问的
      const fullInviteLink = `${window.location.protocol}//${window.location.host}/join/${capsuleId}`;
      capsuleData.inviteLink = fullInviteLink;
      setInviteLink(fullInviteLink);
    }
    
    // 添加胶囊（使用我们生成的ID）
    addCapsule({ ...capsuleData, id: capsuleId });
    setNewCapsuleId(capsuleId);

    if (currentUser) {
      const drafts = getDrafts(currentUser.id);
      drafts.forEach(draft => deleteDraft(draft.id));
    }

    if (isGroup) {
      setShowSuccess(true);
    } else {
      navigate('/my', { replace: true });
    }
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
    const maxCount = isGroup ? 19 : 5;
    if (sharedInput.trim() && sharedWith.length < maxCount && !sharedWith.includes(sharedInput.trim())) {
      setSharedWith([...sharedWith, sharedInput.trim()]);
      setSharedInput('');
    }
  };

  const handleRemoveSharedUser = (user: string) => {
    setSharedWith(sharedWith.filter(u => u !== user));
  };

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const steps = isGroup
    ? [
        { id: 1 as Step, title: '胶囊类型', subtitle: '选择个人或集体胶囊' },
        { id: 2 as Step, title: '集体信息', subtitle: '设置胶囊名称和成员' },
        { id: 3 as Step, title: '记录回忆', subtitle: '写下故事，添加照片和语音' },
        { id: 4 as Step, title: '设置时间', subtitle: '选择胶囊开启的日期' },
        { id: 5 as Step, title: '添加标签', subtitle: '选择校园标签' },
        { id: 6 as Step, title: '校园地标', subtitle: '选择胶囊所在的校园地标' },
        { id: 7 as Step, title: '隐私设置', subtitle: '选择可见性和匿名选项' }
      ]
    : [
        { id: 1 as Step, title: '胶囊类型', subtitle: '选择个人或集体胶囊' },
        { id: 2 as Step, title: '选择模板', subtitle: '快速创建专属胶囊' },
        { id: 3 as Step, title: '记录回忆', subtitle: '写下故事，添加照片和语音' },
        { id: 4 as Step, title: '设置时间', subtitle: '选择胶囊开启的日期' },
        { id: 5 as Step, title: '添加标签', subtitle: '选择校园标签' },
        { id: 6 as Step, title: '校园地标', subtitle: '选择胶囊所在的校园地标' },
        { id: 7 as Step, title: '隐私设置', subtitle: '选择可见性和匿名选项' }
      ];

  console.log('steps.length:', steps.length, 'isGroup:', isGroup);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('handleNext called, currentStep:', currentStep, 'steps.length:', steps.length, 'isGroup:', isGroup);
    if (currentStep < steps.length) {
      setCurrentStep((prevStep) => {
        const nextStep = prevStep + 1 as Step;
        console.log('Setting nextStep:', nextStep);
        return nextStep;
      });
    } else {
      console.log('currentStep is not less than steps.length');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1 as Step));
    }
  };

  const handleCopyInviteLink = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert('邀请链接已复制到剪贴板！');
    } catch {
      alert('复制失败，请手动复制');
    }
  };

  if (showSuccess) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center p-4",
        isDark
          ? "bg-gradient-to-b from-dark-bg-primary via-dark-bg-secondary to-dark-bg-primary"
          : "bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7]"
      )}>
        <div className={cn(
              "max-w-md w-full rounded-3xl p-8 shadow-xl border",
              isDark
                ? "bg-dark-bg-secondary border-dark-border-primary shadow-apple-dark"
                : "bg-white border-apple-gray-200 shadow-apple"
            )}>
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-apple-green to-apple-teal flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className={cn(
              "text-2xl font-bold mb-2",
              isDark ? "text-dark-text-primary" : "text-gray-800"
            )}>集体胶囊创建成功！🎉</h1>
            <p className={cn(
              "text-sm",
              isDark ? "text-dark-text-secondary" : "text-gray-600"
            )}>分享邀请链接给你的小伙伴们</p>
          </div>

          <div className={cn(
            "rounded-xl p-4 mb-6",
            isDark ? "bg-dark-bg-tertiary" : "bg-gray-50"
          )}>
            <label className={cn(
              "text-sm font-medium mb-2 block",
              isDark ? "text-dark-text-secondary" : "text-gray-700"
            )}>邀请链接</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className={cn(
                  "flex-1 border rounded-lg px-3 py-2 text-sm",
                  isDark
                    ? "bg-dark-bg-secondary border-dark-border-secondary text-dark-text-primary"
                    : "bg-white border-gray-200 text-gray-600"
                )}
              />
              <button
                onClick={handleCopyInviteLink}
                className="px-4 py-2 bg-gradient-to-r from-apple-pink to-apple-purple text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate(`/capsule/${newCapsuleId}`)}
              className="w-full py-3 bg-gradient-to-r from-apple-green to-apple-teal text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              查看胶囊详情
            </button>
            <button
              onClick={() => navigate('/my')}
              className={cn(
                "w-full py-3 transition-colors",
                isDark
                  ? "text-dark-text-secondary hover:text-dark-text-primary"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              前往我的胶囊
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen pb-32",
      isDark
        ? "bg-gradient-to-b from-dark-bg-primary via-dark-bg-secondary to-dark-bg-primary"
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
              isDark ? "text-dark-text-secondary" : "text-apple-gray-600"
            )} />
          </button>
          <h1 className={cn(
            "font-bold text-lg",
            isDark ? "text-dark-text-primary" : "text-apple-gray-800"
          )}>创建时光胶囊</h1>
          <div className="w-10 flex items-center justify-center">
            {lastSavedAt && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                isDark ? "text-dark-text-tertiary" : "text-apple-gray-400"
              )}>
                <Save className="w-3 h-3" />
                <span>已保存</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        {showDraftPrompt && currentUser && (
          <div className={cn(
            "mb-6 p-4 border rounded-2xl",
            isDark
              ? "bg-dark-bg-tertiary border-dark-border-secondary"
              : "bg-gradient-to-r from-candy-yellow/20 to-candy-orange/20 border border-candy-yellow/30"
          )}>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-candy-orange shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className={cn(
                  "font-medium mb-2",
                  isDark ? "text-dark-text-primary" : "text-gray-800"
                )}>发现未完成的草稿</p>
                <div className="space-y-2">
                  {getDrafts(currentUser.id).map((draft) => (
                    <div key={draft.id} className={cn(
                      "flex items-center justify-between rounded-xl p-3",
                      isDark ? "bg-dark-bg-secondary" : "bg-white"
                    )}>
                      <div>
                        <p className={cn(
                          "text-sm font-medium",
                          isDark ? "text-dark-text-secondary" : "text-gray-700"
                        )}>
                          {draft.content?.substring(0, 30) || '未命名草稿'}...
                        </p>
                        <p className={cn(
                          "text-xs",
                          isDark ? "text-dark-text-tertiary" : "text-gray-500"
                        )}>
                          {new Date(draft.updatedAt).toLocaleString('zh-CN')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadDraft(draft)}
                          className="px-3 py-1.5 bg-gradient-to-r from-candy-pink to-candy-purple text-white text-sm rounded-lg"
                        >
                          恢复
                        </button>
                        <button
                          onClick={() => deleteDraft(draft.id)}
                          className={cn(
                            "p-1.5 hover:text-red-500",
                            isDark ? "text-dark-text-tertiary" : "text-gray-400"
                          )}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowDraftPrompt(false)}
                  className={cn(
                    "mt-2 text-sm hover:text-gray-700",
                    isDark ? "text-dark-text-tertiary hover:text-dark-text-secondary" : "text-gray-500"
                  )}
                >
                  忽略，创建新胶囊
                </button>
              </div>
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className={cn(
            "mb-6 p-4 border rounded-2xl",
            isDark
              ? "bg-dark-error-bg border-dark-error-border"
              : "bg-[#fdecea] border border-[#fcd5ce]"
          )}>
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-[#e57373] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className={cn(
                  "font-medium mb-1",
                  isDark ? "text-dark-error-text" : "text-[#c62828]"
                )}>请检查以下问题：</p>
                <ul className={cn(
                  "text-sm space-y-1",
                  isDark ? "text-dark-error-text" : "text-[#d32f2f]"
                )}>
                  {errors.map((err, idx) => (
                    <li key={idx}>• {err}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className={cn(
                  "font-bold",
                  isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
                )}>{steps[currentStep - 1].title}</h2>
                <p className={cn(
                  "text-sm",
                  isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
                )}>{steps[currentStep - 1].subtitle}</p>
              </div>
            </div>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1">
                <div className={cn(
                  "w-full h-2 rounded-full transition-all duration-300",
                  currentStep >= step.id 
                    ? "bg-gradient-to-r from-candy-pink to-candy-purple" 
                    : isDark ? "bg-dark-border-secondary" : "bg-[#e0d6f0]"
                )} />
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <Section title="胶囊类型" subtitle="选择个人或集体胶囊" isDark={isDark}>
              <div className="space-y-6">
                <ToggleButton
                  active={!isGroup}
                  onClick={() => setIsGroup(false)}
                  icon={<Sparkles className="w-5 h-5" />}
                  title="个人胶囊"
                  description="仅您一人创建和管理"
                  isDark={isDark}
                />
                <ToggleButton
                  active={isGroup}
                  onClick={() => setIsGroup(true)}
                  icon={<Users className="w-5 h-5" />}
                  title="集体胶囊"
                  description="1-20人共同创建，毕业季/社团专属"
                  isDark={isDark}
                />
                <div className="h-16 flex items-center justify-center">
                  <p className="text-sm text-gray-500 text-center">
                    选择一种胶囊类型后，点击"下一步"继续
                  </p>
                </div>
              </div>
            </Section>
          )}

          {currentStep === 2 && isGroup && (
            <Section title="集体信息" subtitle="设置胶囊名称和成员" isDark={isDark}>
              <div className="space-y-4">
                <div>
                  <label className={cn(
                    "text-sm font-medium mb-2 block",
                    isDark ? "text-dark-text-secondary" : "text-[#5a4b7a]"
                  )}>集体胶囊名称</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="例如：402宿舍毕业胶囊"
                    className={cn(
                      "w-full border rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:border-[#c8b6e2] transition-all",
                      isDark
                        ? "bg-dark-bg-secondary border-dark-border-secondary text-dark-text-primary placeholder:text-dark-text-tertiary"
                        : "bg-white border-[#e0d6f0]"
                    )}
                  />
                </div>
                <div>
                  <label className={cn(
                    "text-sm font-medium mb-2 block",
                    isDark ? "text-dark-text-secondary" : "text-[#5a4b7a]"
                  )}>邀请成员（最多19人）</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={sharedInput}
                      onChange={(e) => setSharedInput(e.target.value)}
                      placeholder="输入成员昵称"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSharedUser()}
                      className={cn(
                        "flex-1 border rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-[#c8b6e2] transition-all",
                        isDark
                          ? "bg-dark-bg-secondary border-dark-border-secondary text-dark-text-primary placeholder:text-dark-text-tertiary"
                          : "bg-white border-[#e0d6f0]"
                      )}
                    />
                    <button
                      type="button"
                      onClick={handleAddSharedUser}
                      className="px-4 py-2.5 bg-gradient-to-br from-candy-pink to-candy-purple text-white rounded-2xl"
                    >
                      <UserPlus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sharedWith.map((user, index) => (
                      <div key={index} className={cn(
                        "flex items-center gap-1 rounded-full px-3 py-1 text-sm",
                        isDark
                          ? "bg-dark-bg-tertiary text-dark-text-secondary"
                          : "bg-gradient-to-r from-candy-pink/20 to-candy-purple/20 text-gray-700"
                      )}>
                        <span>{user}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSharedUser(user)}
                          className={cn(
                            "hover:text-red-500",
                            isDark ? "text-dark-text-tertiary" : "text-gray-500"
                          )}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className={cn(
                    "text-xs mt-1",
                    isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
                  )}>已添加 {sharedWith.length}/19 位成员</p>
                </div>
              </div>
            </Section>
          )}

          {currentStep === 2 && !isGroup && (
            <Section title="选择模板" subtitle="快速创建专属胶囊" isDark={isDark}>
              {(() => {
                const availableLimitedTemplates = getAvailableLimitedTemplates();
                if (availableLimitedTemplates.length > 0) {
                  return (
                    <div className="mb-6">
                      <h3 className="font-medium text-[#5a4b7a] mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-candy-yellow" />
                        限定模板
                      </h3>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {availableLimitedTemplates.map((template) => (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => handleTemplateSelect(template)}
                            className={cn(
                              "p-3 rounded-xl border-2 transition-all relative",
                              selectedTemplate?.id === template.id
                                ? "border-candy-yellow bg-candy-yellow/10"
                                : isDark
                                  ? "border-dark-border-secondary bg-dark-bg-secondary hover:border-candy-yellow"
                                  : "border-[#e0d6f0] bg-white hover:border-candy-yellow"
                            )}
                          >
                            <div className="absolute top-2 right-2 bg-gradient-to-r from-candy-yellow to-candy-orange text-white text-xs px-2 py-1 rounded-full font-bold">
                              {template.limitedBadge}
                            </div>
                            <div className="aspect-video rounded-lg overflow-hidden mb-2">
                              <img 
                                src={template.backgroundImage} 
                                alt={template.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className={cn(
                              "font-medium text-sm",
                              isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
                            )}>{template.name}</h3>
                            <p className={cn(
                              "text-xs",
                              isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
                            )}>{template.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              <h3 className="font-medium text-[#5a4b7a] mb-3">常规模板</h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.filter(t => !t.isLimited).map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateSelect(template)}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all",
                      selectedTemplate?.id === template.id
                        ? "border-candy-purple bg-candy-purple/10"
                        : isDark
                          ? "border-dark-border-secondary bg-dark-bg-secondary hover:border-candy-pink"
                          : "border-[#e0d6f0] bg-white hover:border-candy-pink"
                    )}
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-2">
                      <img 
                        src={template.backgroundImage} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className={cn(
                      "font-medium text-sm",
                      isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
                    )}>{template.name}</h3>
                    <p className={cn(
                      "text-xs",
                      isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
                    )}>{template.description}</p>
                  </button>
                ))}
              </div>
            </Section>
          )}

          {(currentStep === 3 && !isGroup) || (currentStep === 3 && isGroup) ? (
            <>
              <Section title="写下你的故事" subtitle="记录此刻的心情" isDark={isDark}>
                <button
                  type="button"
                  onClick={() => setShowAiSection(!showAiSection)}
                  className="mb-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-candy-yellow to-candy-orange text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-4 h-4" />
                  {showAiSection ? '隐藏AI助手' : 'AI帮我写'}
                </button>

                {showAiSection && (
                  <div className={cn(
                    "mb-4 p-4 border rounded-2xl",
                    isDark
                      ? "bg-dark-bg-tertiary border-dark-border-secondary"
                      : "bg-gradient-to-r from-candy-yellow/10 to-candy-orange/10 border border-candy-yellow/20"
                  )}>
                    <div className="space-y-3">
                      <div>
                        <label className={cn(
                          "text-sm font-medium mb-2 block",
                          isDark ? "text-dark-text-secondary" : "text-gray-700"
                        )}>输入关键词（1-3个）</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={aiKeywordInput}
                            onChange={(e) => setAiKeywordInput(e.target.value)}
                            placeholder="例如：军训、室友、考研"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddAiKeyword()}
                            className={cn(
                              "flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-candy-pink",
                              isDark
                                ? "bg-dark-bg-secondary border-dark-border-secondary text-dark-text-primary placeholder:text-dark-text-tertiary"
                                : "bg-white border-gray-200"
                            )}
                          />
                          <button
                            type="button"
                            onClick={handleAddAiKeyword}
                            disabled={aiKeywords.length >= 3}
                            className="px-3 py-2 bg-candy-pink text-white rounded-xl text-sm disabled:opacity-50"
                          >
                            添加
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {aiKeywords.map((keyword, idx) => (
                            <span key={idx} className={cn(
                              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm",
                              isDark
                                ? "bg-dark-bg-secondary text-dark-text-secondary"
                                : "bg-candy-pink/20 text-candy-purple"
                            )}>
                              {keyword}
                              <button
                                type="button"
                                onClick={() => handleRemoveAiKeyword(keyword)}
                                className={cn(
                                  "hover:text-red-500",
                                  isDark ? "text-dark-text-tertiary" : "text-candy-purple"
                                )}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerateAiTemplates}
                        disabled={aiKeywords.length === 0 || isGeneratingAi}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-xl font-medium disabled:opacity-50"
                      >
                        {isGeneratingAi ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            生成中...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            生成文案
                          </>
                        )}
                      </button>

                      {aiTemplates.length > 0 && (
                        <div className="space-y-2 mt-4">
                          <p className={cn(
                            "text-sm font-medium",
                            isDark ? "text-dark-text-secondary" : "text-gray-700"
                          )}>选择一个模板：</p>
                          {aiTemplates.map((template) => (
                            <div
                              key={template.id}
                              className={cn(
                                "p-3 rounded-xl border-2 cursor-pointer transition-all",
                                "bg-gradient-to-br " + getStyleColor(template.style),
                                "border-transparent hover:border-candy-pink"
                              )}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={cn(
                                  "flex items-center gap-1 text-sm font-medium",
                                  isDark ? "text-dark-text-primary" : "text-gray-700"
                                )}>
                                  {getStyleIcon(template.style)} {template.styleName}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUseAiTemplate(template.content)}
                                  className={cn(
                                    "flex items-center gap-1 px-3 py-1 rounded-lg text-sm hover:bg-gray-50",
                                    isDark
                                      ? "bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-bg-tertiary"
                                      : "bg-white text-gray-700"
                                  )}
                                >
                                  <Copy className="w-3 h-3" />
                                  使用
                                </button>
                              </div>
                              <p className={cn(
                                "text-sm",
                                isDark ? "text-dark-text-secondary" : "text-gray-600"
                              )}>{template.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setContent(e.target.value);
                      }
                    }}
                    placeholder="请输入10-500字的回忆内容..."
                    style={{
                      color: selectedTemplate?.fontStyle.color || (isDark ? '#e2e8f0' : '#333'),
                      fontFamily: selectedTemplate?.fontStyle.fontFamily
                    }}
                    className={cn(
                      "w-full min-h-[150px] border rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 transition-all",
                      content.length > 0 && content.length < 10
                        ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                        : content.length === 500
                        ? "border-orange-400 focus:ring-orange-400 focus:border-orange-400"
                        : isDark
                          ? "bg-dark-bg-secondary border-dark-border-secondary focus:ring-candy-pink focus:border-candy-pink"
                          : "bg-white border-[#e0d6f0] focus:ring-candy-pink focus:border-candy-pink"
                    )}
                  />
                  <div className={cn(
                    "absolute bottom-3 right-3 text-xs font-medium",
                    content.length > 0 && content.length < 10 ? "text-red-500" :
                    content.length === 500 ? "text-orange-500" : isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
                  )}>
                    {content.length}/500
                    {content.length > 0 && content.length < 10 && <span className="ml-1">（至少10字）</span>}
                  </div>
                </div>
                {isPublic && !isGroup && (
                  <input
                    type="text"
                    value={blindBoxDescription}
                    onChange={(e) => setBlindBoxDescription(e.target.value)}
                    placeholder="盲盒简介（10-20字）"
                    className={cn(
                      "w-full mt-3 border rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-[#c8b6e2] transition-all",
                      isDark
                        ? "bg-dark-bg-secondary border-dark-border-secondary text-dark-text-primary placeholder:text-dark-text-tertiary"
                        : "bg-white border-[#e0d6f0]"
                    )}
                  />
                )}
              </Section>

              <Section title="添加照片" subtitle="留下此刻的画面" isDark={isDark}>
                <p className={cn(
                  "text-sm mb-3",
                  isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
                )}>上传1张或多张照片（可选，未上传将自动生成）</p>
                <ImageUploader images={images} onChange={setImages} isDark={isDark} />
              </Section>

              <Section title="语音留言" subtitle="让声音穿越时空（可选）" isDark={isDark}>
                <AudioRecorder audioUrl={audio} onChange={setAudio} isDark={isDark} />
              </Section>
            </>
          ) : null}

          {(currentStep === 4 && !isGroup) || (currentStep === 4 && isGroup) ? (
            <Section title="开启时间" subtitle="选择胶囊开启的日期" isDark={isDark}>
              <p className={cn(
                "text-sm mb-3",
                isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
              )}>请选择1天后至1年内的任意时间</p>
              <div className="relative">
                <Calendar className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                  isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
                )} />
                <input
                  type="datetime-local"
                  value={openDate}
                  onChange={(e) => setOpenDate(e.target.value)}
                  min={minDate.toISOString().slice(0, 16)}
                  max={maxDate.toISOString().slice(0, 16)}
                  className={cn(
                    "w-full border rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-[#c8b6e2] transition-all",
                    isDark
                      ? "bg-dark-bg-secondary border-dark-border-secondary text-dark-text-primary"
                      : "bg-white border-[#e0d6f0]"
                  )}
                />
              </div>
            </Section>
          ) : null}

          {(currentStep === 5 && !isGroup) || (currentStep === 5 && isGroup) ? (
            <Section title="校园标签" subtitle="选择1-3个校园标签" isDark={isDark}>
              <p className={cn(
                "text-sm mb-3",
                isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
              )}>选择与你的回忆相关的标签</p>
              <div className="flex flex-wrap gap-2">
                {campusTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-all",
                      selectedTags.includes(tag)
                        ? "bg-gradient-to-r from-candy-pink/20 to-candy-purple/20 text-candy-purple border border-candy-pink"
                        : isDark
                          ? "bg-dark-bg-secondary text-dark-text-secondary border border-dark-border-secondary hover:border-candy-pink"
                          : "bg-white text-[#8a7ab5] border border-[#e0d6f0] hover:border-candy-pink"
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </Section>
          ) : null}

          {(currentStep === 6 && !isGroup) || (currentStep === 6 && isGroup) ? (
            <Section title="校园地标" subtitle="选择胶囊所在的校园地标" isDark={isDark}>
              <p className={cn(
                "text-sm mb-3",
                isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
              )}>选择一个与你的回忆相关的校园地标</p>
              <div className="grid grid-cols-2 gap-3">
                {landmarks.map((landmark) => (
                  <button
                    key={landmark.id}
                    type="button"
                    onClick={() => {
                      setSelectedLandmarkId(landmark.id);
                    }}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all flex flex-col items-center text-center",
                      selectedLandmarkId === landmark.id
                        ? "border-candy-pink bg-candy-pink/10"
                        : isDark
                          ? "border-dark-border-secondary bg-dark-bg-secondary hover:border-candy-pink"
                          : "border-[#e0d6f0] bg-white hover:border-candy-pink"
                    )}
                  >
                    <span className="text-2xl mb-2">{landmark.icon}</span>
                    <h3 className={cn(
                      "font-medium text-sm",
                      isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
                    )}>{landmark.name}</h3>
                    <p className={cn(
                      "text-xs mt-1",
                      isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
                    )}>{landmark.description}</p>
                  </button>
                ))}
              </div>
              <p className={cn(
                "text-xs mt-3 text-center",
                isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
              )}>选择地标后，你的胶囊将在校园时光地图上显示</p>
            </Section>
          ) : null}

          {(currentStep === 7 && !isGroup) || (currentStep === 7 && isGroup) ? (
            <>
              <Section title="隐私设置" subtitle="选择胶囊的可见性" isDark={isDark}>
                <div className="space-y-3">
                  <ToggleButton
                    active={isPublic}
                    onClick={() => setIsPublic(true)}
                    icon={<Globe className="w-5 h-5" />}
                    title="公开"
                    description="展示在胶囊广场，所有用户可见"
                    isDark={isDark}
                  />
                  <ToggleButton
                    active={!isPublic}
                    onClick={() => setIsPublic(false)}
                    icon={<Lock className="w-5 h-5" />}
                    title="私密"
                    description={isGroup ? "仅集体成员可见" : "仅您本人可见"}
                    isDark={isDark}
                  />
                </div>

                {!isPublic && !isGroup && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className={cn(
                        "text-sm font-medium mb-2",
                        isDark ? "text-dark-text-secondary" : "text-[#5a4b7a]"
                      )}>胶囊密码（可选）</h3>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="设置4-6位数字密码"
                        className={cn(
                          "w-full border rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-[#c8b6e2] transition-all",
                          isDark
                            ? "bg-dark-bg-secondary border-dark-border-secondary text-dark-text-primary placeholder:text-dark-text-tertiary"
                            : "bg-white border-[#e0d6f0]"
                        )}
                      />
                    </div>

                    <div>
                      <h3 className={cn(
                        "text-sm font-medium mb-2",
                        isDark ? "text-dark-text-secondary" : "text-[#5a4b7a]"
                      )}>指定好友可见（可选）</h3>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={sharedInput}
                          onChange={(e) => setSharedInput(e.target.value)}
                          placeholder="输入好友昵称"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSharedUser()}
                          className={cn(
                            "flex-1 border rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#c8b6e2] focus:border-[#c8b6e2] transition-all",
                            isDark
                              ? "bg-dark-bg-secondary border-dark-border-secondary text-dark-text-primary placeholder:text-dark-text-tertiary"
                              : "bg-white border-[#e0d6f0]"
                          )}
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
                          <div key={index} className={cn(
                            "flex items-center gap-1 rounded-full px-3 py-1 text-sm",
                            isDark
                              ? "bg-dark-bg-tertiary text-dark-text-secondary"
                              : "bg-[#f5f3f7] text-[#5a4b7a]"
                          )}>
                            <span>{user}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSharedUser(user)}
                              className={cn(
                                "hover:text-[#8a7ab5]",
                                isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
                              )}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className={cn(
                        "text-xs mt-1",
                        isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
                      )}>最多邀请5位好友</p>
                    </div>
                  </div>
                )}
              </Section>

              <Section title="匿名发布" subtitle="隐藏您的身份" isDark={isDark}>
                <div className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border",
                  isDark
                    ? "bg-dark-bg-secondary border-dark-border-secondary"
                    : "bg-white border-[#e0d6f0]"
                )}>
                  <div>
                    <p className={cn(
                      "font-medium",
                      isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
                    )}>匿名发布</p>
                    <p className={cn(
                      "text-xs",
                      isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
                    )}>其他用户无法看到您的昵称</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={cn(
                      "w-12 h-7 rounded-full transition-colors relative",
                      isAnonymous ? "bg-gradient-to-r from-candy-pink to-candy-purple" : isDark ? "bg-dark-border-secondary" : "bg-[#e0d6f0]"
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
          ) : null}

          {currentStep >= steps.length && (
            <div className="flex items-center justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl transition-all",
                  currentStep === 1
                    ? "opacity-50 cursor-not-allowed"
                    : isDark
                      ? "bg-dark-bg-secondary border border-dark-border-secondary text-dark-text-primary hover:border-candy-pink"
                      : "bg-white border border-[#e0d6f0] text-[#5a4b7a] hover:border-candy-pink"
                )}
              >
                <ChevronLeft className="w-5 h-5" />
                上一步
              </button>
              
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-br from-candy-pink to-candy-purple text-white font-bold rounded-2xl shadow-lg shadow-candy-pink/30 active:scale-[0.98] transition-transform"
              >
                封印时光胶囊 ✨
              </button>
            </div>
          )}
        </form>

        {currentStep < steps.length && (
          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl transition-all",
                currentStep === 1
                  ? "opacity-50 cursor-not-allowed"
                  : isDark
                    ? "bg-dark-bg-secondary border border-dark-border-secondary text-dark-text-primary hover:border-candy-pink"
                    : "bg-white border border-[#e0d6f0] text-[#5a4b7a] hover:border-candy-pink"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
              上一步
            </button>
            
            <button
              type="button"
              onClick={() => {
                console.log('Next button clicked, currentStep:', currentStep);
                if (currentStep < steps.length) {
                  const nextStep = currentStep + 1 as Step;
                  console.log('Setting currentStep to:', nextStep);
                  setCurrentStep(nextStep);
                }
              }}
              className="flex items-center gap-2 px-6 py-4 bg-gradient-to-br from-candy-pink to-candy-purple text-white rounded-2xl font-bold shadow-lg shadow-candy-pink/30 hover:opacity-90 transition-all active:scale-95"
            >
              下一步
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, subtitle, children, isDark }: { title: string; subtitle: string; children: React.ReactNode; isDark: boolean }) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className={cn(
          "font-bold flex items-center gap-2",
          isDark ? "text-dark-text-primary" : "text-[#5a4b7a]"
        )}>
          <span className="w-1.5 h-5 bg-gradient-to-b from-candy-pink to-candy-purple rounded-full" />
          {title}
        </h2>
        <p className={cn(
          "text-sm ml-3.5",
          isDark ? "text-dark-text-tertiary" : "text-[#a093c2]"
        )}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function ToggleButton({ active, onClick, icon, title, description, isDark }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; description: string; isDark: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-3 text-left",
        active 
          ? "border-candy-pink bg-gradient-to-r from-candy-pink/10 to-candy-purple/10" 
          : isDark 
            ? "border-dark-border-secondary bg-dark-bg-secondary hover:border-candy-pink"
            : "border-[#e0d6f0] bg-white hover:border-candy-pink"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        active ? "bg-gradient-to-r from-candy-pink to-candy-purple text-white" : isDark ? "bg-dark-bg-tertiary text-dark-text-tertiary" : "bg-[#f5f3f7] text-[#a093c2]"
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <p className={cn("font-medium", active ? (isDark ? "text-dark-text-primary" : "text-[#5a4b7a]") : (isDark ? "text-dark-text-secondary" : "text-[#8a7ab5]"))}>
          {title}
        </p>
        <p className={cn("text-xs", isDark ? "text-dark-text-tertiary" : "text-[#a093c2]")}>{description}</p>
      </div>
      {active && <CheckCircle2 className="w-5 h-5 text-candy-pink" />}
    </button>
  );
}
