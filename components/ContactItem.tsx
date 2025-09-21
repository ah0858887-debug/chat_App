import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MessageCircle, Phone, Video } from 'lucide-react-native';
import { User, Contact } from '@/types';

interface ContactItemProps {
  contact: Contact;
  user?: User;
  onPress: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  showActions?: boolean;
}

export default function ContactItem({
  contact,
  user,
  onPress,
  onCall,
  onVideoCall,
  showActions = false,
}: ContactItemProps) {
  const displayName = contact.contactName || (user ? `${user.firstName} ${user.lastName}` : contact.phoneNumber);
  const statusText = user?.isOnline ? 'Online' : user?.lastSeen ? `Last seen ${formatLastSeen(user.lastSeen)}` : 'Offline';

  function formatLastSeen(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: user?.profilePicture || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=100&h=100&fit=crop',
          }}
          style={styles.avatar}
        />
        {user?.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={[styles.status, { color: user?.isOnline ? '#4CAF50' : '#666' }]}>
          {contact.isRegistered ? statusText : 'Not on ChatApp'}
        </Text>
      </View>

      {showActions && contact.isRegistered && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onVideoCall}>
            <Video size={20} color="#075E54" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onCall}>
            <Phone size={20} color="#075E54" />
          </TouchableOpacity>
        </View>
      )}

      {!contact.isRegistered && (
        <TouchableOpacity style={styles.inviteButton}>
          <Text style={styles.inviteText}>Invite</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  status: {
    fontSize: 14,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  inviteButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inviteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});