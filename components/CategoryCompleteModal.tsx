import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Dimensions,
  Image 
} from 'react-native';

interface CategoryCompleteModalProps {
  visible: boolean;
  onClose: () => void;
  categoryName: string;
  khairisEarned: number;
}

const { width, height } = Dimensions.get('window');

export const CategoryCompleteModal: React.FC<CategoryCompleteModalProps> = ({
  visible,
  onClose,
  categoryName,
  khairisEarned
}) => {
  const shareIcon = require('../assets/icons/customShareIcon.png');
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Icon circle */}
          <View style={styles.iconContainer}>
            <Image source={shareIcon} style={styles.iconImage} onError={() => console.log('Image failed to load')}/>
          </View>

          {/* Text content */}
          <View style={styles.textContent}>
            <Text style={styles.title}>Category Complete!</Text>
            <Text style={styles.subtitle}>+{khairisEarned} Khairis earned ✨</Text>
          </View>

          {/* Close button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 160,
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7E0F3B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 22,
  },
  iconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  iconImage: {
    width: 24,
    height: 24,
    //tintColor: '#FFFFFF',
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#181818',
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'Sofia-Pro-Regular'
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Sofia-Pro-Light'
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeButtonText: {
    fontSize: 22,
    color: '#999999',
    fontWeight: '400',
  },
});