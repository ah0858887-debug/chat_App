import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import { FirebaseService } from '@/services/FirebaseService';
import ContactItem from '@/components/ContactItem';
import { Contact, User } from '@/types';

interface ContactWithUser {
  contact: Contact;
  user?: User;
}

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<ContactWithUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    // Mock contacts - in real app, load from device contacts and Firebase
    const mockContactsWithUsers: ContactWithUser[] = [
      {
        contact: {
          id: '1',
          userId: 'current_user',
          contactUserId: 'user1',
          contactName: 'Alice Johnson',
          phoneNumber: '+1234567890',
          isRegistered: true,
          addedAt: new Date(),
        },
        user: {
          id: 'user1',
          phoneNumber: '+1234567890',
          firstName: 'Alice',
          lastName: 'Johnson',
          profilePicture: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop',
          status: 'Available',
          isOnline: true,
          lastSeen: new Date(),
          createdAt: new Date(),
        },
      },
      {
        contact: {
          id: '2',
          userId: 'current_user',
          contactUserId: 'user2',
          contactName: 'Bob Smith',
          phoneNumber: '+1987654321',
          isRegistered: true,
          addedAt: new Date(),
        },
        user: {
          id: 'user2',
          phoneNumber: '+1987654321',
          firstName: 'Bob',
          lastName: 'Smith',
          profilePicture: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=100&h=100&fit=crop',
          status: 'Busy',
          isOnline: false,
          lastSeen: new Date(Date.now() - 3600000),
          createdAt: new Date(),
        },
      },
      {
        contact: {
          id: '3',
          userId: 'current_user',
          contactUserId: '',
          contactName: 'Carol Davis',
          phoneNumber: '+1122334455',
          isRegistered: false,
          addedAt: new Date(),
        },
      },
    ];
    setContacts(mockContactsWithUsers);
  };

  const startChat = async (contactWithUser: ContactWithUser) => {
    const { contact, user } = contactWithUser;
    
    if (!contact.isRegistered) {
      Alert.alert(
        'User not registered',
        `${contact.contactName} is not using ChatApp yet. Would you like to send them an invitation?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Invite', onPress: () => inviteUser(contactWithUser) },
        ]
      );
      return;
    }

    if (!currentUser || !user) return;

    try {
      // Create or get existing chat
      const chatResult = await FirebaseService.createChat([currentUser.id, user.id]);
      if (chatResult.success && chatResult.chat) {
        router.push(`/chat/${chatResult.chat.id}?name=${user.firstName} ${user.lastName}&avatar=${user.profilePicture}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to start chat');
    }
  };

  const inviteUser = (contactWithUser: ContactWithUser) => {
    Alert.alert('Invitation sent', `Invitation sent to ${contactWithUser.contact.contactName}`);
  };

  const filteredContacts = contacts.filter(contact =>
    (contact.contact.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    contact.contact.phoneNumber.includes(searchQuery)
  );

  const renderContactItem = ({ item }: { item: ContactWithUser }) => (
    <ContactItem
      contact={item.contact}
      user={item.user}
      onPress={() => startChat(item)}
      showActions={true}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Contact</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id}
        style={styles.contactsList}
        showsVerticalScrollIndicator={false}
      />

      {filteredContacts.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No contacts found</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#075E54',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  contactsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});