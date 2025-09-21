import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Chat, Message, Contact, StatusUpdate, Call } from '@/types';

// Mock Firebase service - replace with actual Firebase implementation
class FirebaseServiceClass {
  private users: Map<string, User> = new Map();
  private chats: Map<string, Chat> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private contacts: Map<string, Contact[]> = new Map();
  private statusUpdates: Map<string, StatusUpdate[]> = new Map();
  private calls: Map<string, Call[]> = new Map();
  private currentUser: User | null = null;
  private listeners: Map<string, Function[]> = new Map();

  // Initialize with mock data
  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock users
    const mockUsers: User[] = [
      {
        id: 'user1',
        phoneNumber: '+1234567890',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop',
        status: 'Hey there! I am using ChatApp',
        isOnline: true,
        lastSeen: new Date(),
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: 'user2',
        phoneNumber: '+1987654321',
        email: 'sarah@example.com',
        firstName: 'Sarah',
        lastName: 'Smith',
        profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop',
        status: 'Busy at work',
        isOnline: false,
        lastSeen: new Date(Date.now() - 3600000),
        createdAt: new Date(Date.now() - 172800000),
      },
      {
        id: 'user3',
        phoneNumber: '+1122334455',
        email: 'mike@example.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        profilePicture: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=100&h=100&fit=crop',
        status: 'Available',
        isOnline: true,
        lastSeen: new Date(),
        createdAt: new Date(Date.now() - 259200000),
      },
    ];

    mockUsers.forEach(user => this.users.set(user.id, user));
  }

  // Authentication methods
  async signUp(credentials: {
    phoneNumber?: string;
    email?: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ success: boolean; user?: User; error?: string; needsOTP?: boolean }> {
    try {
      await this.simulateDelay(2000);

      const userId = `user_${Date.now()}`;
      const newUser: User = {
        id: userId,
        phoneNumber: credentials.phoneNumber || '',
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        status: 'Hey there! I am using ChatApp',
        isOnline: true,
        lastSeen: new Date(),
        createdAt: new Date(),
      };

      this.users.set(userId, newUser);
      this.currentUser = newUser;
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));

      return {
        success: true,
        user: newUser,
        needsOTP: !!credentials.phoneNumber,
      };
    } catch (error) {
      return { success: false, error: 'Failed to create account' };
    }
  }

  async signIn(credentials: {
    phoneNumber?: string;
    email?: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; error?: string; needsOTP?: boolean }> {
    try {
      await this.simulateDelay(1500);

      // Mock authentication
      if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
        const user = Array.from(this.users.values())[0];
        this.currentUser = user;
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
      }

      if (credentials.phoneNumber && credentials.password === 'demo123') {
        const user = Array.from(this.users.values()).find(u => u.phoneNumber === credentials.phoneNumber);
        if (user) {
          this.currentUser = user;
          await AsyncStorage.setItem('currentUser', JSON.stringify(user));
          return { success: true, user, needsOTP: true };
        }
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async verifyOTP(otp: string): Promise<{ success: boolean; error?: string }> {
    await this.simulateDelay(1000);
    return otp.length === 6 ? { success: true } : { success: false, error: 'Invalid OTP' };
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) return this.currentUser;
    
    try {
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        return this.currentUser;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
    
    return null;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    await AsyncStorage.removeItem('currentUser');
  }

  // User management
  async updateUserProfile(updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    if (!this.currentUser) return { success: false, error: 'Not authenticated' };

    try {
      const updatedUser = { ...this.currentUser, ...updates };
      this.users.set(updatedUser.id, updatedUser);
      this.currentUser = updatedUser;
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async searchUsersByPhone(phoneNumber: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => 
      user.phoneNumber.includes(phoneNumber)
    );
  }

  // Contacts management
  async getContacts(userId: string): Promise<Contact[]> {
    return this.contacts.get(userId) || [];
  }

  async addContact(userId: string, phoneNumber: string, contactName?: string): Promise<{ success: boolean; contact?: Contact; error?: string }> {
    try {
      const contactUser = Array.from(this.users.values()).find(u => u.phoneNumber === phoneNumber);
      const contactId = `contact_${Date.now()}`;
      
      const contact: Contact = {
        id: contactId,
        userId,
        contactUserId: contactUser?.id || '',
        contactName,
        phoneNumber,
        isRegistered: !!contactUser,
        addedAt: new Date(),
      };

      const userContacts = this.contacts.get(userId) || [];
      userContacts.push(contact);
      this.contacts.set(userId, userContacts);

      return { success: true, contact };
    } catch (error) {
      return { success: false, error: 'Failed to add contact' };
    }
  }

  // Chat management
  async getChats(userId: string): Promise<Chat[]> {
    return Array.from(this.chats.values()).filter(chat => 
      chat.participants.includes(userId)
    );
  }

  async createChat(participants: string[]): Promise<{ success: boolean; chat?: Chat; error?: string }> {
    try {
      const chatId = `chat_${Date.now()}`;
      const chat: Chat = {
        id: chatId,
        participants,
        lastMessageAt: new Date(),
        unreadCount: {},
        createdAt: new Date(),
      };

      this.chats.set(chatId, chat);
      this.messages.set(chatId, []);

      return { success: true, chat };
    } catch (error) {
      return { success: false, error: 'Failed to create chat' };
    }
  }

  async getChatMessages(chatId: string): Promise<Message[]> {
    return this.messages.get(chatId) || [];
  }

  async sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'status'>): Promise<{ success: boolean; message?: Message; error?: string }> {
    try {
      const messageId = `msg_${Date.now()}`;
      const newMessage: Message = {
        ...message,
        id: messageId,
        timestamp: new Date(),
        status: 'sending',
      };

      const chatMessages = this.messages.get(message.chatId) || [];
      chatMessages.push(newMessage);
      this.messages.set(message.chatId, chatMessages);

      // Update chat last message
      const chat = this.chats.get(message.chatId);
      if (chat) {
        chat.lastMessage = newMessage;
        chat.lastMessageAt = new Date();
        this.chats.set(message.chatId, chat);
      }

      // Simulate message status updates
      setTimeout(() => {
        newMessage.status = 'sent';
        this.notifyListeners(`messages_${message.chatId}`, chatMessages);
      }, 1000);

      setTimeout(() => {
        newMessage.status = 'delivered';
        this.notifyListeners(`messages_${message.chatId}`, chatMessages);
      }, 2000);

      this.notifyListeners(`messages_${message.chatId}`, chatMessages);
      return { success: true, message: newMessage };
    } catch (error) {
      return { success: false, error: 'Failed to send message' };
    }
  }

  async markMessageAsRead(messageId: string, chatId: string): Promise<void> {
    const messages = this.messages.get(chatId) || [];
    const message = messages.find(m => m.id === messageId);
    if (message) {
      message.status = 'read';
      this.notifyListeners(`messages_${chatId}`, messages);
    }
  }

  // Status updates
  async getStatusUpdates(userId: string): Promise<StatusUpdate[]> {
    const allStatuses = Array.from(this.statusUpdates.values()).flat();
    const contacts = await this.getContacts(userId);
    const contactUserIds = contacts.map(c => c.contactUserId);
    
    return allStatuses.filter(status => 
      contactUserIds.includes(status.userId) || status.userId === userId
    );
  }

  async createStatusUpdate(status: Omit<StatusUpdate, 'id' | 'timestamp' | 'expiresAt' | 'viewedBy'>): Promise<{ success: boolean; status?: StatusUpdate; error?: string }> {
    try {
      const statusId = `status_${Date.now()}`;
      const newStatus: StatusUpdate = {
        ...status,
        id: statusId,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        viewedBy: [],
      };

      const userStatuses = this.statusUpdates.get(status.userId) || [];
      userStatuses.push(newStatus);
      this.statusUpdates.set(status.userId, userStatuses);

      return { success: true, status: newStatus };
    } catch (error) {
      return { success: false, error: 'Failed to create status' };
    }
  }

  // Real-time listeners
  onMessagesUpdate(chatId: string, callback: (messages: Message[]) => void): () => void {
    const key = `messages_${chatId}`;
    const listeners = this.listeners.get(key) || [];
    listeners.push(callback);
    this.listeners.set(key, listeners);

    // Initial data
    callback(this.messages.get(chatId) || []);

    // Return unsubscribe function
    return () => {
      const currentListeners = this.listeners.get(key) || [];
      const index = currentListeners.indexOf(callback);
      if (index > -1) {
        currentListeners.splice(index, 1);
        this.listeners.set(key, currentListeners);
      }
    };
  }

  onChatsUpdate(userId: string, callback: (chats: Chat[]) => void): () => void {
    const key = `chats_${userId}`;
    const listeners = this.listeners.get(key) || [];
    listeners.push(callback);
    this.listeners.set(key, listeners);

    // Initial data
    this.getChats(userId).then(callback);

    return () => {
      const currentListeners = this.listeners.get(key) || [];
      const index = currentListeners.indexOf(callback);
      if (index > -1) {
        currentListeners.splice(index, 1);
        this.listeners.set(key, currentListeners);
      }
    };
  }

  private notifyListeners(key: string, data: any): void {
    const listeners = this.listeners.get(key) || [];
    listeners.forEach(callback => callback(data));
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const FirebaseService = new FirebaseServiceClass();