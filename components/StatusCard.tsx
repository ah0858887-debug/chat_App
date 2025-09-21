import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { Eye, Plus } from 'lucide-react-native';
import { StatusUpdate, User } from '@/types';

interface StatusCardProps {
  status?: StatusUpdate;
  user: User;
  isOwn?: boolean;
  onPress: () => void;
  onAddStatus?: () => void;
}

export default function StatusCard({
  status,
  user,
  isOwn = false,
  onPress,
  onAddStatus,
}: StatusCardProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (isOwn && !status) {
    return (
      <TouchableOpacity style={styles.container} onPress={onAddStatus}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
          <View style={styles.addButton}>
            <Plus size={16} color="#fff" />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>My Status</Text>
          <Text style={styles.subtitle}>Tap to add status update</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
        {status && !status.viewedBy.includes(user.id) && (
          <View style={styles.unviewedRing} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>
          {isOwn ? 'My Status' : `${user.firstName} ${user.lastName}`}
        </Text>
        {status && (
          <Text style={styles.time}>{formatTime(status.timestamp)}</Text>
        )}
      </View>
      {status && !isOwn && (
        <Eye size={20} color={status.viewedBy.includes(user.id) ? '#999' : '#075E54'} />
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
  unviewedRing: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 27,
    borderWidth: 3,
    borderColor: '#25D366',
  },
  addButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});