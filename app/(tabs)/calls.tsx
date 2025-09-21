import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { Phone, PhoneCall, Video, PhoneMissed } from 'lucide-react-native';

interface CallRecord {
  id: string;
  name: string;
  avatar: string;
  timestamp: string;
  type: 'incoming' | 'outgoing' | 'missed';
  callType: 'voice' | 'video';
  duration?: string;
}

export default function CallsTab() {
  const [calls, setCalls] = useState<CallRecord[]>([
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop',
      timestamp: '10:30 AM',
      type: 'outgoing',
      callType: 'voice',
      duration: '5:23',
    },
    {
      id: '2',
      name: 'Sarah Smith',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop',
      timestamp: 'Yesterday',
      type: 'incoming',
      callType: 'video',
      duration: '12:45',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=100&h=100&fit=crop',
      timestamp: '2 days ago',
      type: 'missed',
      callType: 'voice',
    },
  ]);

  const getCallIcon = (call: CallRecord) => {
    const color = call.type === 'missed' ? '#F44336' : '#4CAF50';
    const size = 20;

    if (call.callType === 'video') {
      return <Video size={size} color={color} />;
    }

    switch (call.type) {
      case 'missed':
        return <PhoneMissed size={size} color={color} />;
      case 'incoming':
        return <Phone size={size} color={color} />;
      case 'outgoing':
        return <PhoneCall size={size} color={color} />;
      default:
        return <Phone size={size} color={color} />;
    }
  };

  const renderCallItem = ({ item }: { item: CallRecord }) => (
    <TouchableOpacity style={styles.callItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.callContent}>
        <View style={styles.callHeader}>
          <Text style={[styles.callName, item.type === 'missed' && styles.missedCall]}>
            {item.name}
          </Text>
          <View style={styles.callMeta}>
            {getCallIcon(item)}
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>
        {item.duration && (
          <Text style={styles.duration}>Duration: {item.duration}</Text>
        )}
      </View>
      <TouchableOpacity style={styles.callBackButton}>
        {item.callType === 'video' ? (
          <Video size={24} color="#075E54" />
        ) : (
          <Phone size={24} color="#075E54" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calls</Text>
      </View>

      <FlatList
        data={calls}
        renderItem={renderCallItem}
        keyExtractor={(item) => item.id}
        style={styles.callsList}
        showsVerticalScrollIndicator={false}
      />

      {calls.length === 0 && (
        <View style={styles.emptyState}>
          <Phone size={64} color="#ccc" />
          <Text style={styles.emptyText}>No recent calls</Text>
          <Text style={styles.emptySubtext}>Your call history will appear here</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#075E54',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  callsList: {
    flex: 1,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  callContent: {
    flex: 1,
    marginLeft: 16,
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  missedCall: {
    color: '#F44336',
  },
  callMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  callBackButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});