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
    category: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
    visible = true,
    onAnimationComplete,
    onFadeOutComplete,
    category
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const lineAnim = useRef(new Animated.Value(0)).current;
    const [shouldRender, setShouldRender] = React.useState(visible);

    const fadeOut = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(lineAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start(() => {
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
            // Si visible devient false, commencer le fade out
            fadeOut();
        }
    }, [visible]);

    if (!shouldRender) return null;

    return (
        <LinearGradient
            colors={['#931748', '#43061C']}
            start={{ x: 0.12, y: 0 }} // Angle de 168.05deg converti en coordonnées start/end
            end={{ x: 0.88, y: 1 }}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" backgroundColor="#931748" />
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                    }
                ]}
            >
                <Text style={styles.text}>Khair.</Text>
            </Animated.View>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        //backgroundColor: '#8B1538',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 64,
        fontWeight: '300', // Light weight
        color: '#FFFFFF',
        fontFamily: 'Classico', // Vous pouvez remplacer par votre police personnalisée
        letterSpacing: 2,
        marginBottom: 40,
    },

    underlineText: {
        fontSize: 24,
        fontWeight: '300', // Light weight
        color: '#FFFFFF',
        fontFamily: 'Classico', // Vous pouvez remplacer par votre police personnalisée
        letterSpacing: 2,
        marginTop: 40,
    },
    line: {
        height: 2,
        backgroundColor: '#FFFFFF',
        borderRadius: 1,
    },
});

export default LoadingScreen;