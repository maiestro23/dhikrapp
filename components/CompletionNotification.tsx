import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Share } from 'react-native';
import { Send } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface CompletionNotificationProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    icon?: string;
    duration?: number;
    iconBackgroundColor?: string;
    categoryName?: string;
    khairisAmount: number;
}



export const CompletionNotification: React.FC<CompletionNotificationProps> = ({
    visible,
    onClose,
    title = "Category Complete!",
    subtitle = "+25 Khairis earned ✨",
    duration = 4000,
    iconBackgroundColor = "#7E0F3B",
    categoryName,
    khairisAmount = 15

}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-50)).current;
    const timerRef = useRef<number | null>(null);

    const closeNotification = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -50,
                duration: 1000,
                useNativeDriver: true,
            })
        ]).start(() => {
            onClose();
        });
    };

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ]).start();

            const timer = setTimeout(() => {
                closeNotification();
            }, duration);

            timerRef.current = timer;

            return () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
            };
        }
    }, [visible, fadeAnim, slideAnim, onClose, duration]);

    if (!visible) return null;

    const handleShare = async () => {
        try {
            const shareContent = {
                message: `🎉 I just completed the "${categoryName}" category and earned ${khairisAmount} Khairis! ✨\n\nJoin me in building a daily dhikr habit with this amazing app! 🤲`,
                title: 'Dhikr App - Category Complete!',
                url: 'https://apps.apple.com/app/khair-daily-adhkar/id6744126455',
            };

            const result = await Share.share(shareContent);

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared via:', result.activityType);
                } else {
                    console.log('Shared successfully');
                }
                onClose();
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <Animated.View
            style={[
                styles.overlay,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
                    <TouchableOpacity onPress={handleShare} activeOpacity={0.7}>
                        <Send size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.textContent}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeNotification}
                    activeOpacity={0.7}
                >
                    <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        zIndex: 10,
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.9,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 22,
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