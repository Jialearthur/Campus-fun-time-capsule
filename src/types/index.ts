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
}

export interface Comment {
  id: string;
  capsuleId: string;
  userId: string;
  nickname: string;
  content: string;
  createdAt: string;
}

export interface CapsuleStore {
  capsules: Capsule[];
  comments: Record<string, Comment[]>;
  currentUser: User | null;
  addCapsule: (capsule: Omit<Capsule, 'id' | 'likes' | 'comments' | 'favorites' | 'createdAt'>) => void;
  likeCapsule: (id: string) => void;
  addComment: (capsuleId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  favoriteCapsule: (id: string) => void;
  getCapsuleById: (id: string) => Capsule | undefined;
  getPublicCapsules: () => Capsule[];
  getUserCapsules: (userId: string) => Capsule[];
}
