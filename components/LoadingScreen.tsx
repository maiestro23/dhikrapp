import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {
    visible?: boolean;
    onAnimationComplete?: () => void;
    onFadeOutComplete?: () => void;
    category?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
    visible = true,
    onAnimationComplete,
    onFadeOutComplete,
    category = 'General'
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const lineAnim = useRef(new Animated.Value(0)).current;
    const [shouldRender, setShouldRender] = React.useState(visible);

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 800, // Durée du fade out
            useNativeDriver: true,
        }).start(() => {
            setShouldRender(false);
            onFadeOutComplete?.();
        });
    };

    useEffect(() => {
        if (visible) {
            setShouldRender(true);
            // Reset animations
            fadeAnim.setValue(0);
            lineAnim.setValue(0);

            // Animation sequence
            Animated.sequence([
                // Fade in background
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                // Animate line
                Animated.timing(lineAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: false,
                }),
            ]).start(() => {
                // Wait a bit then call completion callback
                setTimeout(() => {
                    onAnimationComplete?.();
                    // Start fade out after completion
                    setTimeout(() => {
                        fadeOut();
                    }, 300);
                }, 1000);
            });
        } else if (!visible && shouldRender) {
            fadeOut();
        }
    }, [visible]);

    if (!shouldRender) return null;

    return (
        <Animated.View 
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                }
            ]}
        >
            <LinearGradient
                colors={['#931748', '#43061C']}
                start={{ x: 0.12, y: 0 }}
                end={{ x: 0.88, y: 1 }}
                style={styles.gradientContainer}
            />
            
            <StatusBar barStyle="light-content" backgroundColor="#931748" />
            
            <View style={styles.content}>
                <Text style={styles.text}>Khair.</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    gradientContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 64,
        fontWeight: '300',
        color: '#FFFFFF',
        fontFamily: 'Classico',
        letterSpacing: 2,
        marginBottom: 40,
    },
    line: {
        height: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 1,
        marginVertical: 20,
    },
    underlineText: {
        fontSize: 24,
        fontWeight: '300',
        color: '#FFFFFF',
        fontFamily: 'Classico',
        letterSpacing: 2,
        marginTop: 20,
    },
});

export default LoadingScreen;