import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export interface MediaResult {
  success: boolean;
  uri?: string;
  type?: 'image' | 'video' | 'audio';
  duration?: number;
  error?: string;
}

class MediaServiceClass {
  private recording: Audio.Recording | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      // Request camera and media library permissions
      const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
      const mediaResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      // Request audio recording permission
      const audioResult = await Audio.requestPermissionsAsync();

      return (
        cameraResult.status === 'granted' &&
        mediaResult.status === 'granted' &&
        audioResult.status === 'granted'
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  async pickImageFromCamera(): Promise<MediaResult> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return { success: false, error: 'Camera permission denied' };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled) {
        return { success: false, error: 'User cancelled' };
      }

      return {
        success: true,
        uri: result.assets[0].uri,
        type: 'image',
      };
    } catch (error) {
      return { success: false, error: 'Failed to capture image' };
    }
  }

  async pickImageFromLibrary(): Promise<MediaResult> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return { success: false, error: 'Media library permission denied' };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled) {
        return { success: false, error: 'User cancelled' };
      }

      return {
        success: true,
        uri: result.assets[0].uri,
        type: 'image',
      };
    } catch (error) {
      return { success: false, error: 'Failed to pick image' };
    }
  }

  async pickVideoFromCamera(): Promise<MediaResult> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return { success: false, error: 'Camera permission denied' };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60, // 60 seconds max
      });

      if (result.canceled) {
        return { success: false, error: 'User cancelled' };
      }

      return {
        success: true,
        uri: result.assets[0].uri,
        type: 'video',
        duration: result.assets[0].duration,
      };
    } catch (error) {
      return { success: false, error: 'Failed to capture video' };
    }
  }

  async startVoiceRecording(): Promise<MediaResult> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return { success: false, error: 'Audio permission denied' };
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to start recording' };
    }
  }

  async stopVoiceRecording(): Promise<MediaResult> {
    try {
      if (!this.recording) {
        return { success: false, error: 'No active recording' };
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      const status = await this.recording.getStatusAsync();

      this.recording = null;

      if (!uri) {
        return { success: false, error: 'Failed to get recording URI' };
      }

      return {
        success: true,
        uri,
        type: 'audio',
        duration: status.durationMillis,
      };
    } catch (error) {
      return { success: false, error: 'Failed to stop recording' };
    }
  }

  async cancelVoiceRecording(): Promise<void> {
    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
      }
    } catch (error) {
      console.error('Error cancelling recording:', error);
    }
  }

  isRecording(): boolean {
    return this.recording !== null;
  }

  async playAudio(uri: string): Promise<{ success: boolean; sound?: Audio.Sound; error?: string }> {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
      return { success: true, sound };
    } catch (error) {
      return { success: false, error: 'Failed to play audio' };
    }
  }
}

export const MediaService = new MediaServiceClass();