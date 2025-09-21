import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Send, Paperclip, Mic, Camera, Image as ImageIcon } from 'lucide-react-native';
import { FirebaseService } from '@/services/FirebaseService';
import { MediaService } from '@/services/MediaService';
import ChatBubble from '@/components/ChatBubble';
import { Message, User } from '@/types';


export default function ChatScreen() {
  const { id, name, avatar } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    const user = await FirebaseService.getCurrentUser();
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    setCurrentUser(user);
    loadMessages();
  };

  const loadMessages = () => {
    if (!id || !currentUser) return;

    const unsubscribe = FirebaseService.onMessagesUpdate(id as string, (newMessages) => {
      setMessages(newMessages);
      setTimeout(() => scrollToBottom(), 100);
    });

    return unsubscribe;
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !currentUser || !id) return;

    const messageData = {
      chatId: id as string,
      senderId: currentUser.id,
      content: inputText.trim(),
      type: 'text',
    };

    setInputText('');
    
    try {
      await FirebaseService.sendMessage(messageData);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleMediaPress = () => {
    Alert.alert(
      'Send Media',
      'Choose media type',
      [
        { text: 'Camera', onPress: () => sendImageFromCamera() },
        { text: 'Gallery', onPress: () => sendImageFromGallery() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const sendImageFromCamera = async () => {
    const result = await MediaService.pickImageFromCamera();
    if (result.success && result.uri) {
      await sendMediaMessage(result.uri, 'image');
    }
  };

  const sendImageFromGallery = async () => {
    const result = await MediaService.pickImageFromLibrary();
    if (result.success && result.uri) {
      await sendMediaMessage(result.uri, 'image');
    }
  };

  const sendMediaMessage = async (uri: string, type: 'image' | 'video' | 'voice') => {
    if (!currentUser || !id) return;

    const messageData = {
      chatId: id as string,
      senderId: currentUser.id,
      content: '',
      type,
      mediaUrl: uri,
    };

    try {
      await FirebaseService.sendMessage(messageData);
    } catch (error) {
      Alert.alert('Error', 'Failed to send media');
    }
  };

  const startVoiceRecording = async () => {
    const result = await MediaService.startVoiceRecording();
    if (result.success) {
      setIsRecording(true);
    } else {
      Alert.alert('Error', result.error || 'Failed to start recording');
    }
  };

  const stopVoiceRecording = async () => {
    const result = await MediaService.stopVoiceRecording();
    setIsRecording(false);
    
    if (result.success && result.uri) {
      await sendMediaMessage(result.uri, 'voice');
    } else {
      Alert.alert('Error', result.error || 'Failed to stop recording');
    }
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatBubble
      message={item}
      isOwn={item.senderId === currentUser?.id}
      onMediaPress={(uri, type) => {
        // Handle media preview
        console.log('Media pressed:', uri, type);
      }}
    />
  );

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={{ uri: avatar as string }} style={styles.headerAvatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{name}</Text>
          <Text style={styles.headerStatus}>
            last seen recently
          </Text>
        </View>
        <View style={styles.headerActions}>
          {/* Video call, voice call buttons would go here */}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={scrollToBottom}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton} onPress={handleMediaPress}>
            <Paperclip size={24} color="#666" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
          />
          {inputText.trim() ? (
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.micButton, isRecording && styles.recordingButton]}
              onPress={isRecording ? stopVoiceRecording : startVoiceRecording}
            >
              <Mic size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#075E54',
  },
  backButton: {
    marginRight: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerStatus: {
    fontSize: 14,
    color: '#B2DFDB',
  },
  headerActions: {
    flexDirection: 'row',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#E5DDD5',
  },
  messagesContainer: {
    paddingVertical: 16,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  attachButton: {
    marginRight: 12,
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#f8f8f8',
  },
  sendButton: {
    backgroundColor: '#25D366',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButton: {
    marginLeft: 12,
    marginBottom: 8,
  },
  recordingButton: {
    backgroundColor: '#FF5722',
    borderRadius: 22,
    padding: 10,
  },
});