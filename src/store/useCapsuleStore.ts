import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Capsule, Comment, User, CapsuleStore } from '../types';

const initialCapsules: Capsule[] = [
  {
    id: '1',
    userId: 'demo1',
    content: '今天和室友在图书馆度过了美好的一天，希望明年的今天我们都能实现自己的目标！',
    images: ['https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=university%20library%20study%20scene%20warm%20lighting&image_size=square'],
    openAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
    isAnonymous: false,
    tags: ['学习', '室友', '目标'],
    likes: 42,
    comments: 8,
    favorites: 15,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
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
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
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
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
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

const currentUser: User = {
  id: 'user-' + Date.now(),
  nickname: '校园旅人',
  avatar: ''
};

export const useCapsuleStore = create<CapsuleStore>()(
  persist(
    (set, get) => ({
      capsules: initialCapsules,
      comments: initialComments,
      currentUser,

      addCapsule: (capsuleData) => set((state) => ({
        capsules: [...state.capsules, {
          ...capsuleData,
          id: Date.now().toString(),
          likes: 0,
          comments: 0,
          favorites: 0,
          createdAt: new Date().toISOString()
        }]
      })),

      likeCapsule: (id) => set((state) => ({
        capsules: state.capsules.map(c =>
          c.id === id ? { ...c, likes: c.likes + 1 } : c
        )
      })),

      addComment: (capsuleId, commentData) => set((state) => {
        const newComment: Comment = {
          ...commentData,
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

      getUserCapsules: (userId) => get().capsules.filter(c => c.userId === userId)
    }),
    {
      name: 'capsule-storage'
    }
  )
);
