import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';
import { X, Link, Search } from 'lucide-react-native';
import { router } from 'expo-router';

interface CategoryFinishedPopupProps {
  visible: boolean;
  onClose: () => void;
  khairisEarned: number;
  categoryName: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const CategoryFinishedPopup: React.FC<CategoryFinishedPopupProps> = ({
  visible,
  onClose,
  khairisEarned,
  categoryName,
}) => {
  const handleShareApp = () => {
    // Logique de partage de l'app
    console.log('Share app with friends');
    onClose();
  };

  const handleExploreMore = () => {
    onClose();
    router.replace('/discover');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <Pressable style={styles.popup} onPress={(e) => e.stopPropagation()}>
            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#8C8F7B" />
            </TouchableOpacity>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>Barakah Received!</Text>
              
              <Text style={styles.subtitle}>
                +{khairisEarned} Khairis earned
              </Text>

              <Text style={styles.completionText}>
                You have completed the "{categoryName}" category! 🎉
              </Text>

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={handleShareApp}
                >
                  <Link size={20} color="white" />
                  <Text style={styles.shareButtonText}>Share app with friends</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.exploreButton}
                  onPress={handleExploreMore}
                >
                  <Search size={20} color="white" />
                  <Text style={styles.exploreButtonText}>Explore more categories</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 24,
    width: Math.min(SCREEN_WIDTH - 40, 350),
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Classico',
    fontSize: 28,
    color: '#181818',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Sofia-Pro',
    fontSize: 18,
    color: '#6F7C50',
    textAlign: 'center',
    marginBottom: 16,
  },
  completionText: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 16,
    color: '#8C8F7B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7E0F3B',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  shareButtonText: {
    fontFamily: 'Sofia-Pro',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7E0F3B',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  exploreButtonText: {
    fontFamily: 'Sofia-Pro',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});