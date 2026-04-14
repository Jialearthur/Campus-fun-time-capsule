export interface User {
  id: string;
  nickname: string;
  avatar?: string;
}

export interface CapsuleMember {
  id: string;
  userId: string;
  nickname: string;
  avatar?: string;
  joinedAt: string;
  content?: string;
  images?: string[];
  audio?: string;
}

export interface CapsuleReply {
  id: string;
  capsuleId: string;
  userId: string;
  nickname: string;
  content: string;
  images?: string[];
  createdAt: string;
}

export interface DraftCapsule {
  id: string;
  userId: string;
  content?: string;
  images?: string[];
  audio?: string;
  openAt?: string;
  isPublic?: boolean;
  isAnonymous?: boolean;
  tags?: string[];
  template?: string;
  backgroundImage?: string;
  fontStyle?: string;
  password?: string;
  sharedWith?: string[];
  isGroup?: boolean;
  groupMembers?: string[];
  groupName?: string;
  landmarkId?: string;
  savedAt: string;
  updatedAt: string;
}

export interface AITextTemplate {
  id: string;
  style: 'warm' | 'funny' | 'literary';
  styleName: string;
  content: string;
}

export interface Comment {
  id: string;
  capsuleId: string;
  userId: string;
  nickname: string;
  content: string;
  createdAt: string;
}

export interface CampusLandmark {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  icon: string;
}

export interface Anniversary {
  id: string;
  userId: string;
  name: string;
  date: string;
  type: 'birthday' | 'schoolEntry' | 'anniversary' | 'graduation' | 'custom';
  reminderTime: '00:00' | '09:00';
  createdAt: string;
  updatedAt: string;
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
  isGroup?: boolean;
  groupName?: string;
  groupMembers?: CapsuleMember[];
  inviteLink?: string;
  replies?: CapsuleReply[];
  landmarkId?: string;
  anniversaryIds?: string[];
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
  drafts: DraftCapsule[];
  landmarks: CampusLandmark[];
  anniversaries: Anniversary[];
  addCapsule: (capsule: Omit<Capsule, 'id' | 'likes' | 'comments' | 'favorites' | 'createdAt'>) => string;
  likeCapsule: (id: string) => void;
  addComment: (capsuleId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'capsuleId'>) => void;
  favoriteCapsule: (id: string) => void;
  getCapsuleById: (id: string) => Capsule | undefined;
  getPublicCapsules: () => Capsule[];
  getUserCapsules: (userId: string) => Capsule[];
  getCapsulesByLandmark: (landmarkId: string) => Capsule[];
  bindWechat: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  updateCapsule: (id: string, updates: Partial<Capsule>) => void;
  saveDraft: (draft: Omit<DraftCapsule, 'id' | 'savedAt' | 'updatedAt'>) => void;
  getDrafts: (userId: string) => DraftCapsule[];
  deleteDraft: (id: string) => void;
  addReply: (capsuleId: string, reply: Omit<CapsuleReply, 'id' | 'createdAt'>) => void;
  joinGroupCapsule: (capsuleId: string, userId: string, nickname: string, avatar?: string) => void;
  addGroupMemberContent: (capsuleId: string, userId: string, content?: string, images?: string[], audio?: string) => void;
  addAnniversary: (anniversary: Omit<Anniversary, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAnniversary: (id: string, updates: Partial<Anniversary>) => void;
  deleteAnniversary: (id: string) => void;
  getUserAnniversaries: (userId: string) => Anniversary[];
  bindCapsuleToAnniversary: (capsuleId: string, anniversaryId: string) => void;
  unbindCapsuleFromAnniversary: (capsuleId: string, anniversaryId: string) => void;
}
