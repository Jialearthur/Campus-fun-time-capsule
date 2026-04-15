import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Capsule, Comment, User, CapsuleStore, CapsuleMember, CapsuleReply, DraftCapsule, CampusLandmark, Anniversary, Achievement } from '../types';

const initialCapsules: Capsule[] = [
  {
    id: '1',
    userId: 'demo1',
    content: '今天和室友在图书馆度过了美好的一天，希望明年的今天我们都能实现自己的目标！',
    images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=university%20library%20study%20scene%20warm%20lighting&image_size=square'],
    openAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
    isAnonymous: false,
    tags: ['学习', '室友', '目标'],
    likes: 42,
    comments: 8,
    favorites: 15,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    replies: [],
    landmarkId: '1',
    isDriftBottle: true
  },
  {
    id: '2',
    userId: 'demo2',
    content: '今天的日落好美，在操场上拍了好多照片。希望未来的自己还记得这份简单的快乐。',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20sunset%20on%20campus%20playground%20warm%20colors&image_size=square',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=silhouette%20of%20students%20walking%20at%20sunset%20university%20campus&image_size=square'
    ],
    openAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
    isAnonymous: true,
    tags: ['日落', '校园', '美好'],
    likes: 78,
    comments: 12,
    favorites: 23,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    landmarkId: '3',
    isDriftBottle: true
  },
  {
    id: '3',
    userId: 'demo3',
    content: '和最好的朋友约定，一年后的今天再来这个咖啡厅！',
    images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cozy%20coffee%20shop%20interior%20warm%20atmosphere%20friends%20chatting&image_size=square'],
    openAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
    isAnonymous: false,
    tags: ['朋友', '约定', '咖啡厅'],
    likes: 56,
    comments: 5,
    favorites: 18,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    landmarkId: '4',
    isDriftBottle: true
  },
  {
    id: '4',
    userId: 'demo4',
    content: '毕业快乐！我们402宿舍永远不散！',
    images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=university%20graduation%20group%20photo%20happy%20students&image_size=square'],
    openAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
    isAnonymous: false,
    tags: ['毕业', '宿舍', '友谊'],
    likes: 128,
    comments: 25,
    favorites: 45,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isGroup: true,
    groupName: '402宿舍毕业胶囊',
    inviteLink: 'http://localhost:5176/join/4',
    groupMembers: [
      { 
        id: 'm1', 
        userId: 'demo4', 
        nickname: '老大', 
        joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        content: '四年时光一晃而过，还记得大一刚入学时我们一起军训的样子。感谢四年的陪伴，未来我们都要成为更好的自己！',
        images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20university%20students%20in%20dormitory%20room&image_size=square']
      },
      { 
        id: 'm2', 
        userId: 'demo5', 
        nickname: '老二', 
        joinedAt: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000).toISOString(),
        content: '最怀念的是我们一起在宿舍熬夜复习，一起吃外卖的日子。希望以后还能经常聚聚！',
        images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friends%20eating%20takeout%20together%20in%20dorm&image_size=square']
      },
      { 
        id: 'm3', 
        userId: 'demo6', 
        nickname: '老三', 
        joinedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        content: '402是我们永远的家，毕业不是结束，而是新的开始。愿我们前程似锦，归来仍是少年！'
      }
    ],
    landmarkId: '6'
  }
];

const initialComments: Record<string, Comment[]> = {
  '1': [
    {
      id: 'c1',
      capsuleId: '1',
      userId: 'demo2',
      nickname: '小太阳',
      content: '加油！一起努力！',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  '2': [
    {
      id: 'c2',
      capsuleId: '2',
      userId: 'demo1',
      nickname: '逐梦人',
      content: '真的好美！我也拍了一张！',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
  ]
};

const initialLandmarks: CampusLandmark[] = [
  { id: '1', name: '图书馆', description: '知识的海洋', latitude: 39.9042, longitude: 116.4074, icon: '📚' },
  { id: '2', name: '教学楼', description: '学习的殿堂', latitude: 39.9052, longitude: 116.4084, icon: '🏫' },
  { id: '3', name: '操场', description: '运动的天地', latitude: 39.9032, longitude: 116.4064, icon: '⚽' },
  { id: '4', name: '食堂', description: '美食的聚集地', latitude: 39.9022, longitude: 116.4054, icon: '🍜' },
  { id: '5', name: '校门', description: '校园的入口', latitude: 39.9062, longitude: 116.4094, icon: '🚪' },
  { id: '6', name: '宿舍区', description: '生活的港湾', latitude: 39.9012, longitude: 116.4044, icon: '🏠' },
  { id: '7', name: '体育馆', description: '竞技的舞台', latitude: 39.9002, longitude: 116.4034, icon: '🏟️' },
  { id: '8', name: '实验楼', description: '探索的实验室', latitude: 39.9072, longitude: 116.4104, icon: '🔬' },
  { id: '9', name: '行政楼', description: '管理的中心', latitude: 39.9082, longitude: 116.4114, icon: '🏛️' },
  { id: '10', name: '花坛', description: '校园的花园', latitude: 39.9042, longitude: 116.4074, icon: '🌸' }
];

const initialAchievements: Achievement[] = [
  {
    id: 'first_capsule',
    name: '初次尝试',
    description: '第一次创建时光胶囊',
    icon: '🌟',
    unlocked: false
  },
  {
    id: 'ten_capsules',
    name: '胶囊收藏家',
    description: '发布10个时光胶囊',
    icon: '🏆',
    unlocked: false
  },
  {
    id: 'ten_likes',
    name: '受欢迎',
    description: '收到10个赞',
    icon: '❤️',
    unlocked: false
  },
  {
    id: 'group_capsule',
    name: '团队合作',
    description: '创建集体胶囊',
    icon: '👥',
    unlocked: false
  },
  {
    id: 'cross_reply',
    name: '时光对话',
    description: '进行跨时空回信',
    icon: '📨',
    unlocked: false
  },
  {
    id: 'share_poster',
    name: '分享达人',
    description: '生成分享海报',
    icon: '📷',
    unlocked: false
  },
  {
    id: 'ten_drift_bottles',
    name: '漂流瓶收集者',
    description: '查看10个漂流瓶',
    icon: '🏺',
    unlocked: false
  },
  {
    id: 'bind_anniversary',
    name: '纪念日守护者',
    description: '绑定纪念日',
    icon: '📅',
    unlocked: false
  }
];

const currentUser: User = {
  id: 'current-user',
  nickname: '校园旅人',
  avatar: ''
};

export const useCapsuleStore = create<CapsuleStore>()(
  persist(
    (set, get) => ({
      capsules: initialCapsules,
      comments: initialComments,
      currentUser,
      notifications: [],
      wechatBound: false,
      drafts: [],
      landmarks: initialLandmarks,
      anniversaries: [],
      achievements: initialAchievements,
      driftBottleReceives: {},
      
      // 重置漂流瓶接收次数（用于测试）
      resetDriftBottleReceives: () => set({ driftBottleReceives: {} }),

      addCapsule: (capsuleData: any) => {
        const capsuleId = capsuleData.id || Date.now().toString();
        const newCapsule = {
          ...capsuleData,
          id: capsuleId,
          likes: 0,
          comments: 0,
          favorites: 0,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          capsules: [...state.capsules, newCapsule]
        }));
        return capsuleId;
      },

      bindWechat: () => set({ wechatBound: true }),

      addNotification: (notificationData) => set((state) => ({
        notifications: [{
          ...notificationData,
          id: Date.now().toString(),
          read: false,
          createdAt: new Date().toISOString()
        }, ...state.notifications]
      })),

      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      })),

      likeCapsule: (id) => set((state) => ({
        capsules: state.capsules.map(c =>
          c.id === id ? { ...c, likes: c.likes + 1 } : c
        )
      })),

      addComment: (capsuleId, commentData) => set((state) => {
        const newComment: Comment = {
          ...commentData,
          capsuleId,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        return {
          comments: {
            ...state.comments,
            [capsuleId]: [...(state.comments[capsuleId] || []), newComment]
          },
          capsules: state.capsules.map(c =>
            c.id === capsuleId ? { ...c, comments: c.comments + 1 } : c
          )
        };
      }),

      favoriteCapsule: (id) => set((state) => ({
        capsules: state.capsules.map(c =>
          c.id === id ? { ...c, favorites: c.favorites + 1 } : c
        )
      })),

      getCapsuleById: (id) => get().capsules.find(c => c.id === id),

      getPublicCapsules: () => get().capsules.filter(c => c.isPublic),

      getUserCapsules: (userId) => get().capsules.filter(c => c.userId === userId),

      updateCapsule: (id, updates) => set((state) => ({
        capsules: state.capsules.map(c => 
          c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        )
      })),

      saveDraft: (draftData) => set((state) => {
        const existingDraftIndex = state.drafts.findIndex(d => d.userId === draftData.userId);
        const now = new Date().toISOString();
        
        if (existingDraftIndex >= 0) {
          const updatedDrafts = [...state.drafts];
          updatedDrafts[existingDraftIndex] = {
            ...updatedDrafts[existingDraftIndex],
            ...draftData,
            updatedAt: now
          };
          return { drafts: updatedDrafts };
        } else {
          const newDraft: DraftCapsule = {
            ...draftData,
            id: Date.now().toString(),
            savedAt: now,
            updatedAt: now
          };
          const allDrafts = [newDraft, ...state.drafts];
          return { drafts: allDrafts.slice(0, 3) };
        }
      }),

      getDrafts: (userId) => get().drafts.filter(d => d.userId === userId),

      deleteDraft: (id) => set((state) => ({
        drafts: state.drafts.filter(d => d.id !== id)
      })),

      addReply: (capsuleId, replyData) => set((state) => {
        const newReply: CapsuleReply = {
          ...replyData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        return {
          capsules: state.capsules.map(c => {
            if (c.id === capsuleId) {
              return {
                ...c,
                replies: [...(c.replies || []), newReply]
              };
            }
            return c;
          })
        };
      }),

      joinGroupCapsule: (capsuleId, userId, nickname, avatar) => set((state) => {
        const newMember: CapsuleMember = {
          id: Date.now().toString(),
          userId,
          nickname,
          avatar,
          joinedAt: new Date().toISOString()
        };
        return {
          capsules: state.capsules.map(c => {
            if (c.id === capsuleId && c.isGroup) {
              return {
                ...c,
                groupMembers: [...(c.groupMembers || []), newMember]
              };
            }
            return c;
          })
        };
      }),

      addGroupMemberContent: (capsuleId, userId, content, images, audio) => set((state) => ({
        capsules: state.capsules.map(c => {
          if (c.id === capsuleId && c.isGroup && c.groupMembers) {
            return {
              ...c,
              groupMembers: c.groupMembers.map(m => {
                if (m.userId === userId) {
                  return { ...m, content, images, audio };
                }
                return m;
              })
            };
          }
          return c;
        })
      })),

      getCapsulesByLandmark: (landmarkId) => get().capsules.filter(c => c.landmarkId === landmarkId),

      addAnniversary: (anniversaryData) => set((state) => ({
        anniversaries: [{
          ...anniversaryData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, ...state.anniversaries]
      })),

      updateAnniversary: (id, updates) => set((state) => ({
        anniversaries: state.anniversaries.map(a => 
          a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
        )
      })),

      deleteAnniversary: (id) => set((state) => ({
        anniversaries: state.anniversaries.filter(a => a.id !== id),
        capsules: state.capsules.map(c => ({
          ...c,
          anniversaryIds: c.anniversaryIds?.filter(aid => aid !== id)
        }))
      })),

      getUserAnniversaries: (userId) => get().anniversaries.filter(a => a.userId === userId),

      bindCapsuleToAnniversary: (capsuleId, anniversaryId) => set((state) => ({
        capsules: state.capsules.map(c => {
          if (c.id === capsuleId) {
            return {
              ...c,
              anniversaryIds: [...(c.anniversaryIds || []), anniversaryId]
            };
          }
          return c;
        })
      })),

      unbindCapsuleFromAnniversary: (capsuleId, anniversaryId) => set((state) => ({
        capsules: state.capsules.map(c => {
          if (c.id === capsuleId) {
            return {
              ...c,
              anniversaryIds: c.anniversaryIds?.filter(aid => aid !== anniversaryId)
            };
          }
          return c;
        })
      })),

      // 时光漂流瓶功能
      setCapsuleAsDriftBottle: (capsuleId) => set((state) => ({
        capsules: state.capsules.map(c => {
          if (c.id === capsuleId && c.isPublic) {
            return {
              ...c,
              isDriftBottle: true,
              driftBottleReceivedBy: []
            };
          }
          return c;
        })
      })),

      getDriftBottle: (userId) => {
        const state = get();
        
        console.log('Current user ID:', userId);
        console.log('All capsules:', state.capsules);
        
        const availableBottles = state.capsules.filter(c => {
          const isDriftBottle = c.isDriftBottle;
          const isPublic = c.isPublic;
          const isNotCurrentUser = c.userId !== userId;
          console.log(`Capsule ${c.id}: isDriftBottle=${isDriftBottle}, isPublic=${isPublic}, isNotCurrentUser=${isNotCurrentUser}`);
          return isDriftBottle && isPublic && isNotCurrentUser;
        });
        
        console.log('Available bottles:', availableBottles);
        
        if (availableBottles.length === 0) {
          return null;
        }
        
        const randomIndex = Math.floor(Math.random() * availableBottles.length);
        const selectedBottle = availableBottles[randomIndex];
        
        console.log('Selected bottle:', selectedBottle);
        return selectedBottle;
      },

      throwDriftBottle: (capsuleId) => set((state) => ({
        capsules: state.capsules.map(c => {
          if (c.id === capsuleId) {
            return {
              ...c,
              driftBottleReceivedBy: []
            };
          }
          return c;
        })
      })),

      // 成就系统功能
      getAchievements: (userId) => {
        // 这里简化处理，实际应该根据用户ID存储成就
        return get().achievements;
      },

      unlockAchievement: (userId, achievementId) => set((state) => ({
        achievements: state.achievements.map(a => {
          if (a.id === achievementId && !a.unlocked) {
            return {
              ...a,
              unlocked: true,
              unlockedAt: new Date().toISOString()
            };
          }
          return a;
        })
      })),

      // 节日限定胶囊功能
      getLimitedEditionTemplates: () => {
        // 这里返回节日限定模板，实际应该根据当前日期判断
        return [
          {
            id: 'back_to_school',
            name: '开学季限定',
            description: '新学期，新开始',
            backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=back%20to%20school%20campus%20theme%20colorful&image_size=square',
            isLimited: true
          },
          {
            id: 'graduation',
            name: '毕业季限定',
            description: '青春不散场',
            backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=graduation%20ceremony%20campus%20theme&image_size=square',
            isLimited: true
          },
          {
            id: 'mid_autumn',
            name: '中秋限定',
            description: '月圆人团圆',
            backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mid%20autumn%20festival%20moon%20campus&image_size=square',
            isLimited: true
          },
          {
            id: 'new_year',
            name: '元旦限定',
            description: '新年新希望',
            backgroundImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20year%20celebration%20campus%20theme&image_size=square',
            isLimited: true
          }
        ];
      }
    }),
    {
      name: 'capsule-storage',
      // 禁用持久化，每次刷新都使用初始数据（用于测试）
      enabled: false
    }
  )
);
