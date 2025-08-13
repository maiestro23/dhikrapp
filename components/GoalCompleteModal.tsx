import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import CustomGoalCompleteImage from '@/assets/images/customGoalCompleteImage';

interface GoalCompleteModalProps {
  visible: boolean;
  onClose: () => void;
  onShare: () => void;
  khairisEarned?: number;
  decorationImage?: any; // Pour votre SVG/image
}

const { width } = Dimensions.get('window');
const modalWidth = Math.min(350, width - 40);

const GoalCompleteModal: React.FC<GoalCompleteModalProps> = ({
  visible,
  onClose,
  onShare,
  khairisEarned,
  decorationImage,
}) => {
  const { theme, isDarkBackground } = useTheme();
  
  // Choisir le composant de background selon le mode
  const BackgroundComponent = isDarkBackground ? LinearGradient : LinearGradient;
  
  // Props pour le LinearGradient selon le mode
  const gradientProps = isDarkBackground ? {
    colors: ['#F5F4E4', '#FFD7DF'],
    locations: [0.1541, 0.829],
    start: { x: 0, y: 0 },
    end: { x: 0.8, y: 1 }
  } : {
    colors: ['#FFFFFF', '#F8F6F4'],
    locations: [0, 1]
  };

  decorationImage = require('@/assets/images/customGoalCompleteImage')
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { width: modalWidth }]}>
          <BackgroundComponent
            {...gradientProps}
            style={styles.modalContent}
          >
            {/* Bouton fermer */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>

            {/* Image décorative */}
            <View style={styles.decorationContainer}>
              <CustomGoalCompleteImage />
            </View>

            {/* Badge Khairis */}
            {isDarkBackground ? (
              <View
                style={[styles.khairsBadge, { backgroundColor: '#FBF0EE' }]}
              >
                <Text style={styles.khairsText}>+{khairisEarned} Khairis</Text>
              </View>
            ) : (
              <LinearGradient
                colors={["#F2FFE5", "#FFD7DF"]}
                start={{ x: 0, y: 0.2 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.khairsBadge}
              >
                <View>
                  <Text style={styles.khairsText}>+{khairisEarned} Khairis</Text>
                </View>
              </LinearGradient>
            )}

            {/* Titre principal */}
            <Text style={styles.title}>Goal Complete!</Text>

            {/* Sous-titre */}
            <Text style={styles.subtitle}>
              You completed your daily adhkar!
            </Text>

            {/* Bouton partager */}
            <TouchableOpacity style={styles.shareButton} onPress={onShare}>
              <Text style={styles.shareButtonText}>Share Achievement</Text>
            </TouchableOpacity>

            {/* Citation */}
            <View style={styles.quoteContainer}>
              <Text style={styles.quote}>
                "Whoever guides to a good deed will get the same reward as the doer of that deed."
              </Text>
              <Text style={styles.quoteSource}>Sahih Muslim</Text>
            </View>
          </BackgroundComponent>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  modalContent: {
    paddingHorizontal: 24,
    //paddingTop: 20,
    paddingBottom: 32,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 10,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeText: {
    fontSize: 28,
    color: '#8C8F7B',
    fontWeight: '300',
  },
  decorationContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    height: 120,
    justifyContent: 'center',
  },
  decorationImage: {
    width: 280,
    height: 120,
  },
  placeholderDecoration: {
    width: 280,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  khairsBadge: {
    backgroundColor: '#F5E6D3',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  khairsText: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 16,
    color: '#7E0F3B',
    fontWeight: '500',
  },
  title: {
    fontFamily: 'Classico',
    fontSize: 32,
    lineHeight: 40,
    color: '#7E0F3B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 18,
    lineHeight: 24,
    color: '#8C8F7B',
    textAlign: 'center',
    marginBottom: 32,
  },
  shareButton: {
    backgroundColor: '#7E0F3B',
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginBottom: 32,
    minWidth: 200,
  },
  shareButtonText: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  quoteContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  quote: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 14,
    lineHeight: 20,
    color: '#8C8F7B',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteSource: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 12,
    color: '#B5B8A5',
    textAlign: 'center',
  },
});

export default GoalCompleteModal;