interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'voice';
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
}

class ChatServiceClass {
  private messages: { [chatId: string]: Message[] } = {};
  private chats: Chat[] = [];

  async sendMessage(chatId: string, text: string): Promise<Message> {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'me',
      timestamp: new Date(),
      status: 'sending',
      type: 'text',
    };

    if (!this.messages[chatId]) {
      this.messages[chatId] = [];
    }
    
    this.messages[chatId].push(message);

    // Simulate message status updates
    setTimeout(() => {
      message.status = 'sent';
    }, 1000);

    setTimeout(() => {
      message.status = 'delivered';
    }, 2000);

    return message;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return this.messages[chatId] || [];
  }

  async getChats(): Promise<Chat[]> {
    // Return mock chats - in real app, fetch from Firebase
    return [
      {
        id: '1',
        name: 'John Doe',
        lastMessage: 'Hey, how are you doing?',
        timestamp: '10:30 AM',
        unreadCount: 2,
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop',
        isOnline: true,
      },
      {
        id: '2',
        name: 'Sarah Smith',
        lastMessage: 'See you tomorrow!',
        timestamp: 'Yesterday',
        unreadCount: 0,
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop',
        isOnline: false,
      },
    ];
  }

  // Real-time message listeners would be implemented here
  onMessagesUpdate(chatId: string, callback: (messages: Message[]) => void) {
    // In real implementation, set up Firebase listeners
    // For now, just return the current messages
    callback(this.messages[chatId] || []);
  }
}

export const ChatService = new ChatServiceClass();