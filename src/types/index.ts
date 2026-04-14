
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
  comments: Record&lt;string, Comment[]&gt;;
  currentUser: User | null;
  addCapsule: (capsule: Omit&lt;Capsule, 'id' | 'likes' | 'comments' | 'favorites' | 'createdAt'&gt;) =&gt; void;
  likeCapsule: (id: string) =&gt; void;
  addComment: (capsuleId: string, comment: Omit&lt;Comment, 'id' | 'createdAt'&gt;) =&gt; void;
  favoriteCapsule: (id: string) =&gt; void;
  getCapsuleById: (id: string) =&gt; Capsule | undefined;
  getPublicCapsules: () =&gt; Capsule[];
  getUserCapsules: (userId: string) =&gt; Capsule[];
}
