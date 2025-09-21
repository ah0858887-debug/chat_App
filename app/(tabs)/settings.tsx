import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { User, Bell, Shield, Moon, CircleHelp as HelpCircle, LogOut, ChevronRight, CreditCard as Edit } from 'lucide-react-native';
import { FirebaseService } from '@/services/FirebaseService';
import { User as UserType } from '@/types';

export default function SettingsTab() {
  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const user = await FirebaseService.getCurrentUser();
    setCurrentUser(user);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await FirebaseService.signOut();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.prompt(
      'Edit Status',
      'Enter your new status',
      async (newStatus) => {
        if (newStatus && currentUser) {
          try {
            await FirebaseService.updateUserProfile({
              ...currentUser,
              status: newStatus,
            });
            setCurrentUser({ ...currentUser, status: newStatus });
          } catch (error) {
            Alert.alert('Error', 'Failed to update status');
          }
        }
      },
      'plain-text',
      currentUser?.status
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && <ChevronRight size={20} color="#999" />}
    </TouchableOpacity>
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
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: currentUser.profilePicture || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=100&h=100&fit=crop',
            }}
            style={styles.profileAvatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {`${currentUser.firstName} ${currentUser.lastName}`}
            </Text>
            <Text style={styles.profileStatus}>{currentUser.status}</Text>
          </View>
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <Edit size={20} color="#075E54" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <SettingItem
            icon={<User size={24} color="#666" />}
            title="Account"
            subtitle="Security notifications, change number"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Shield size={24} color="#666" />}
            title="Privacy"
            subtitle="Block contacts, disappearing messages"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Bell size={24} color="#666" />}
            title="Notifications"
            subtitle="Message, group & call tones"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Moon size={24} color="#666" />}
            title="Theme"
            subtitle="Dark mode, wallpapers"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <SettingItem
            icon={<HelpCircle size={24} color="#666" />}
            title="Help"
            subtitle="Help center, contact us, privacy policy"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <SettingItem
            icon={<LogOut size={24} color="#F44336" />}
            title="Logout"
            onPress={handleLogout}
            showArrow={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  profileStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editProfileButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});