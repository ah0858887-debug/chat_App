export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  status: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface Contact {
  id: string;
  userId: string;
  contactUserId: string;
  contactName?: string;
  phoneNumber: string;
  isRegistered: boolean;
  addedAt: Date;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageAt: Date;
  unreadCount: { [userId: string]: number };
  createdAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'voice' | 'document';
  mediaUrl?: string;
  mediaDuration?: number;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string;
  reactions?: { [userId: string]: string };
}

export interface StatusUpdate {
  id: string;
  userId: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  backgroundColor?: string;
  textColor?: string;
  timestamp: Date;
  expiresAt: Date;
  viewedBy: string[];
}

export interface Call {
  id: string;
  callerId: string;
  receiverId: string;
  type: 'voice' | 'video';
  status: 'missed' | 'answered' | 'declined';
  duration?: number;
  timestamp: Date;
}

export interface AuthCredentials {
  phoneNumber?: string;
  email?: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  needsOTP?: boolean;
  token?: string;
}