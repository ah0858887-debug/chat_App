import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { FirebaseService } from '@/services/FirebaseService';
import { MediaService } from '@/services/MediaService';
import StatusCard from '@/components/StatusCard';
import { StatusUpdate, User } from '@/types';

interface StatusWithUser {
  status: StatusUpdate;
  user: User;
}

export default function StatusTab() {
  const [statusUpdates, setStatusUpdates] = useState<StatusWithUser[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  React.useEffect(() => {
    loadStatusUpdates();
  }, []);

  const loadStatusUpdates = async () => {
    const user = await FirebaseService.getCurrentUser();
    if (!user) return;
    
    setCurrentUser(user);
    
    try {
      const statuses = await FirebaseService.getStatusUpdates(user.id);
      const statusesWithUsers = await Promise.all(
        statuses.map(async (status) => {
          const statusUser = await FirebaseService.getUserById(status.userId);
          return {
            status,
            user: statusUser!,
          };
        })
      );
      setStatusUpdates(statusesWithUsers);
    } catch (error) {
      console.error('Error loading status updates:', error);
    }
  };

  const handleAddStatus = () => {
    Alert.alert(
      'Add Status',
      'Choose status type',
      [
        { text: 'Text', onPress: () => addTextStatus() },
        { text: 'Photo', onPress: () => addPhotoStatus() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const addTextStatus = () => {
    Alert.prompt(
      'Text Status',
      'Enter your status message',
      async (text) => {
        if (text && currentUser) {
          try {
            await FirebaseService.createStatusUpdate({
              userId: currentUser.id,
              content: text,
              backgroundColor: '#25D366',
              textColor: '#fff',
            });
            loadStatusUpdates();
          } catch (error) {
            Alert.alert('Error', 'Failed to add status');
          }
        }
      }
    );
  };

  const addPhotoStatus = async () => {
    const result = await MediaService.pickImageFromCamera();
    if (result.success && result.uri && currentUser) {
      try {
        await FirebaseService.createStatusUpdate({
          userId: currentUser.id,
          content: '',
          mediaUrl: result.uri,
          mediaType: 'image',
        });
        loadStatusUpdates();
      } catch (error) {
        Alert.alert('Error', 'Failed to add photo status');
      }
    }
  };

  const renderStatusItem = ({ item }: { item: StatusWithUser }) => (
    <StatusCard
      status={item.status}
      user={item.user}
      isOwn={item.user.id === currentUser?.id}
      onPress={() => {
        // Handle status view
        console.log('Status pressed:', item.status.id);
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
        <Text style={styles.title}>Status</Text>
      </View>

      <StatusCard
        user={currentUser}
        isOwn={true}
        onPress={() => {}}
        onAddStatus={handleAddStatus}
      />

      <FlatList
        data={statusUpdates}
        renderItem={renderStatusItem}
        keyExtractor={(item) => item.status.id}
        style={styles.statusList}
        showsVerticalScrollIndicator={false}
      />
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
  statusList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});