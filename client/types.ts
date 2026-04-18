export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
}

export interface SwapRequest {
  id: string;
  status: string;
  hoursOffered: number;
  message?: string;
  receiver: User;
}
