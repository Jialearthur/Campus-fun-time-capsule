import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCapsuleStore } from '../store/useCapsuleStore';
import { ArrowLeft, Calendar, Plus, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function AnniversaryManager() {
  const navigate = useNavigate();
  const { 
    currentUser, 
    addAnniversary, 
    updateAnniversary, 
    deleteAnniversary, 
    getUserAnniversaries 
  } = useCapsuleStore();
  
  const [anniversaries, setAnniversaries] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAnniversary, setEditingAnniversary] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'birthday' as 'birthday' | 'schoolEntry' | 'anniversary' | 'graduation' | 'custom',
    reminderTime: '09:00' as '00:00' | '09:00'
  });

  useEffect(() => {
    if (currentUser) {
      const userAnniversaries = getUserAnniversaries(currentUser.id);
      setAnniversaries(userAnniversaries);
    }
  }, [currentUser, getUserAnniversaries]);

  const handleAddAnniversary = () => {
    if (!currentUser || !formData.name || !formData.date) return;
    
    if (editingAnniversary) {
      updateAnniversary(editingAnniversary.id, formData);
    } else {
      addAnniversary({
        userId: currentUser.id,
        ...formData
      });
    }
    
    setShowAddModal(false);
    setEditingAnniversary(null);
    setFormData({
      name: '',
      date: '',
      type: 'birthday',
      reminderTime: '09:00'
    });
  };

  const handleEditAnniversary = (anniversary: any) => {
    setEditingAnniversary(anniversary);
    setFormData({
      name: anniversary.name,
      date: anniversary.date,
      type: anniversary.type,
      reminderTime: anniversary.reminderTime
    });
    setShowAddModal(true);
  };

  const handleDeleteAnniversary = (id: string) => {
    if (window.confirm('确定要删除这个纪念日吗？')) {
      deleteAnniversary(id);
    }
  };

  const typeOptions = [
    { value: 'birthday', label: '生日' },
    { value: 'schoolEntry', label: '入学日' },
    { value: 'anniversary', label: '恋爱纪念日' },
    { value: 'graduation', label: '毕业日' },
    { value: 'custom', label: '自定义' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] via-white to-[#f5f3f7] pb-32">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-[#e0d6f0]">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-[#8a7ab5]" />
          </button>
          <h1 className="font-bold text-lg text-[#5a4b7a]">纪念日管理</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="p-2 text-candy-pink"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        <div className="mb-8">
          <h2 className="font-bold text-xl text-[#5a4b7a] mb-2">我的纪念日</h2>
          <p className="text-sm text-[#a093c2]">管理你的重要日期，让时光胶囊与它们联动</p>
        </div>

        {anniversaries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#e0d6f0]">
            <Calendar className="w-12 h-12 text-[#a093c2] mx-auto mb-4" />
            <p className="text-[#a093c2] mb-4">还没有添加纪念日</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-xl font-medium"
            >
              添加第一个纪念日
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {anniversaries.map((anniversary) => (
              <div key={anniversary.id} className="bg-white rounded-2xl p-4 border border-[#e0d6f0]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-[#5a4b7a]">{anniversary.name}</h3>
                    <p className="text-sm text-[#a093c2]">
                      {typeOptions.find(opt => opt.value === anniversary.type)?.label}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditAnniversary(anniversary)}
                      className="p-1.5 text-[#a093c2] hover:text-candy-purple transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAnniversary(anniversary.id)}
                      className="p-1.5 text-[#a093c2] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#5a4b7a]">
                    <Calendar className="w-4 h-4 text-candy-teal" />
                    <span>{new Date(anniversary.date).toLocaleDateString('zh-CN')}</span>
                  </div>
                  <span className="text-xs bg-candy-green/20 text-candy-green px-2 py-1 rounded-full">
                    {anniversary.reminderTime} 提醒
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-candy-pink/10 to-candy-purple/10 rounded-2xl p-4 border border-candy-pink/20 mt-8">
          <h3 className="font-medium text-[#5a4b7a] mb-2">纪念日联动</h3>
          <p className="text-sm text-[#a093c2]">
            将胶囊与纪念日绑定后，系统会在纪念日当天推送站内提醒，同时展示你在该纪念日发布的所有胶囊
          </p>
        </div>
      </div>

      {/* 添加/编辑纪念日模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#5a4b7a]">
                {editingAnniversary ? '编辑纪念日' : '添加纪念日'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAnniversary(null);
                  setFormData({
                    name: '',
                    date: '',
                    type: 'birthday',
                    reminderTime: '09:00'
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#5a4b7a] mb-2 block">纪念日名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：我的生日"
                  className="w-full bg-white border border-[#e0d6f0] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-candy-pink focus:border-candy-pink transition-all"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#5a4b7a] mb-2 block">日期</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-white border border-[#e0d6f0] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-candy-pink focus:border-candy-pink transition-all"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#5a4b7a] mb-2 block">类型</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full bg-white border border-[#e0d6f0] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-candy-pink focus:border-candy-pink transition-all"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#5a4b7a] mb-2 block">提醒时间</label>
                <select
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value as any })}
                  className="w-full bg-white border border-[#e0d6f0] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-candy-pink focus:border-candy-pink transition-all"
                >
                  <option value="00:00">00:00 (凌晨)</option>
                  <option value="09:00">09:00 (上午)</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleAddAnniversary}
              disabled={!formData.name || !formData.date}
              className="w-full mt-6 py-3 bg-gradient-to-r from-candy-pink to-candy-purple text-white rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingAnniversary ? '保存修改' : '添加纪念日'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
