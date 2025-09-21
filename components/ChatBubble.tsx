import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Play, Download } from 'lucide-react-native';
import { Message } from '@/types';

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  onMediaPress?: (uri: string, type: string) => void;
  onLongPress?: () => void;
}

export default function ChatBubble({
  message,
  isOwn,
  showAvatar = false,
  onMediaPress,
  onLongPress,
}: ChatBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return '◴';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  const renderMediaContent = () => {
    if (!message.mediaUrl) return null;

    switch (message.type) {
      case 'image':
        return (
          <TouchableOpacity
            onPress={() => onMediaPress?.(message.mediaUrl!, 'image')}
            style={styles.mediaContainer}
          >
            <Image source={{ uri: message.mediaUrl }} style={styles.imageMessage} />
          </TouchableOpacity>
        );

      case 'video':
        return (
          <TouchableOpacity
            onPress={() => onMediaPress?.(message.mediaUrl!, 'video')}
            style={styles.mediaContainer}
          >
            <Image source={{ uri: message.mediaUrl }} style={styles.videoMessage} />
            <View style={styles.playButton}>
              <Play size={24} color="#fff" fill="#fff" />
            </View>
            {message.mediaDuration && (
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>
                  {Math.floor(message.mediaDuration / 60000)}:{String(Math.floor((message.mediaDuration % 60000) / 1000)).padStart(2, '0')}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );

      case 'voice':
        return (
          <TouchableOpacity
            onPress={() => onMediaPress?.(message.mediaUrl!, 'voice')}
            style={styles.voiceMessage}
          >
            <Play size={20} color={isOwn ? '#333' : '#fff'} />
            <View style={styles.voiceWaveform}>
              {[...Array(20)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveformBar,
                    {
                      height: Math.random() * 20 + 5,
                      backgroundColor: isOwn ? '#333' : '#fff',
                    },
                  ]}
                />
              ))}
            </View>
            {message.mediaDuration && (
              <Text style={[styles.voiceDuration, { color: isOwn ? '#333' : '#fff' }]}>
                {Math.floor(message.mediaDuration / 1000)}s
              </Text>
            )}
          </TouchableOpacity>
        );

      case 'document':
        return (
          <TouchableOpacity
            onPress={() => onMediaPress?.(message.mediaUrl!, 'document')}
            style={styles.documentMessage}
          >
            <Download size={20} color={isOwn ? '#333' : '#fff'} />
            <Text style={[styles.documentName, { color: isOwn ? '#333' : '#fff' }]}>
              Document
            </Text>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, isOwn ? styles.ownMessage : styles.otherMessage]}>
      <TouchableOpacity
        onLongPress={onLongPress}
        style={[
          styles.bubble,
          isOwn ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        {renderMediaContent()}
        
        {message.content && (
          <Text
            style={[
              styles.messageText,
              isOwn ? styles.ownMessageText : styles.otherMessageText,
              message.type !== 'text' && styles.mediaMessageText,
            ]}
          >
            {message.content}
          </Text>
        )}

        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.timestamp,
              isOwn ? styles.ownTimestamp : styles.otherTimestamp,
            ]}
          >
            {formatTime(message.timestamp)}
          </Text>
          {isOwn && (
            <Text
              style={[
                styles.status,
                message.status === 'read' ? styles.readStatus : styles.normalStatus,
              ]}
            >
              {getStatusIcon(message.status)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    marginHorizontal: 16,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  ownBubble: {
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#333',
  },
  otherMessageText: {
    color: '#333',
  },
  mediaMessageText: {
    marginTop: 8,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    marginRight: 4,
  },
  ownTimestamp: {
    color: '#666',
  },
  otherTimestamp: {
    color: '#999',
  },
  status: {
    fontSize: 12,
  },
  normalStatus: {
    color: '#666',
  },
  readStatus: {
    color: '#4CAF50',
  },
  mediaContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  videoMessage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 150,
    paddingVertical: 4,
  },
  voiceWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    flex: 1,
  },
  waveformBar: {
    width: 2,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  voiceDuration: {
    fontSize: 12,
  },
  documentMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  documentName: {
    marginLeft: 8,
    fontSize: 14,
  },
});