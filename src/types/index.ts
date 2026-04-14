export interface User {
  id: string;
  nickname: string;
  avatar?: string;
}

export interface Capsule {
  id: string;
  userId: string;
  content: string;
  images: string[];
  audio?: string;
  openAt: string;
  isPublic: boolean;
  isAnonymous: boolean;
  tags: string[];
  likes: number;
  comments: number;
  favorites: number;
  createdAt: string;
  template?: string;
  backgroundImage?: string;
  fontStyle?: string;
  password?: string;
  sharedWith?: string[];
  blindBoxDescription?: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  capsuleId: string;
  userId: string;
  nickname: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'capsule_opened' | 'friend_shared' | 'system';
  read: boolean;
  createdAt: string;
  capsuleId?: string;
}

export interface CapsuleStore {
  capsules: Capsule[];
  comments: Record<string, Comment[]>;
  currentUser: User | null;
  notifications: Notification[];
  wechatBound: boolean;
  addCapsule: (capsule: Omit<Capsule, 'id' | 'likes' | 'comments' | 'favorites' | 'createdAt'>) => void;
  likeCapsule: (id: string) => void;
  addComment: (capsuleId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  favoriteCapsule: (id: string) => void;
  getCapsuleById: (id: string) => Capsule | undefined;
  getPublicCapsules: () => Capsule[];
  getUserCapsules: (userId: string) => Capsule[];
  bindWechat: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  updateCapsule: (id: string, updates: Partial<Capsule>) => void;
}
