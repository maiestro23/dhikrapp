import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { ScreenBackground } from '@/components/ScreenBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgressStore } from '@/stores/progressStore';
import NotificationStorage, { NotificationPreferences } from '@/stores/NotificationStorage';
import NotificationService from '@/app/services/NotificationService';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';


const { width } = Dimensions.get('window');

export default function NotificationsScreen() {

    const insets = useSafeAreaInsets();
    const progressStore = useProgressStore();

    // États pour les toggles de notifications
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        allNotifications: false,
        morningEvening: false,
        jummah: false,
        dailyGoals: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const { theme, isDarkBackground } = useTheme();

    // Charger les préférences au montage du composant
    useEffect(() => {
        loadNotificationPreferences();
    }, []);

    const loadNotificationPreferences = async () => {
        try {
            setIsLoading(true);

            // Charger les préférences sauvegardées
            const savedPreferences = await NotificationStorage.loadPreferences();
            setPreferences(savedPreferences);

            // Vérifier les permissions
            const hasPermission = await NotificationService.requestPermissions();
            setPermissionGranted(hasPermission);

            if (!hasPermission) {
                Alert.alert(
                    'Permissions requises',
                    'Pour recevoir des rappels, veuillez autoriser les notifications dans les paramètres de votre appareil.',
                    [{ text: 'OK' }]
                );
            }

        } catch (error) {
            console.error('Erreur lors du chargement des préférences:', error);
            Alert.alert(
                'Erreur',
                'Impossible de charger les préférences de notifications.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour gérer le toggle "All notifications"
    const handleAllNotificationsToggle = async (value: boolean) => {
        try {
            if (!permissionGranted && value) {
                const permission = await NotificationService.requestPermissions();
                if (!permission) {
                    Alert.alert(
                        'Permissions refusées',
                        'Impossible d\'activer les notifications sans autorisation.'
                    );
                    return;
                }
                setPermissionGranted(true);
            }

            const updatedPreferences = await NotificationStorage.setAllNotifications(value);
            setPreferences(updatedPreferences);

            if (value) {
                // Activer toutes les notifications
                await NotificationService.scheduleNotificationsForType('morningEvening');
                await NotificationService.scheduleNotificationsForType('jummah');
                await NotificationService.scheduleNotificationsForType('dailyGoals');
            } else {
                // Désactiver toutes les notifications
                await NotificationService.cancelAllScheduledNotifications();
            }
        } catch (error) {
            console.error('Error toggling all notifications:', error);
            Alert.alert('Erreur', 'Impossible de modifier les préférences de notifications.');
        }
    };

    // Fonction pour gérer les toggles individuels
    const handleIndividualToggle = async (
        key: keyof Omit<NotificationPreferences, 'allNotifications'>,
        value: boolean
    ) => {
        try {
            if (!permissionGranted && value) {
                const permission = await NotificationService.requestPermissions();
                if (!permission) {
                    Alert.alert(
                        'Permissions refusées',
                        'Impossible d\'activer les notifications sans autorisation.'
                    );
                    return;
                }
                setPermissionGranted(true);
            }

            let updatedPreferences = await NotificationStorage.updatePreference(key, value);

            // Si on désactive une notification individuelle, désactiver "All notifications" immédiatement
            if (!value && updatedPreferences.allNotifications) {
                updatedPreferences = await NotificationStorage.updatePreference('allNotifications', false);
            }
            // Si on active une notification et que toutes sont maintenant activées, activer "All notifications"
            else if (value) {
                const allIndividualEnabled = NotificationStorage.areAllIndividualNotificationsEnabled(updatedPreferences);
                if (allIndividualEnabled && !updatedPreferences.allNotifications) {
                    updatedPreferences = await NotificationStorage.updatePreference('allNotifications', true);
                }
            }

            setPreferences(updatedPreferences);

            // Gérer les notifications planifiées
            if (value) {
                await NotificationService.scheduleNotificationsForType(key as any);
            } else {
                await NotificationService.cancelNotificationsByType(key);
            }
        } catch (error) {
            console.error('Error toggling individual notification:', error);
            Alert.alert('Erreur', 'Impossible de modifier cette préférence de notification.');
        }
    };

    const handleTestNotification = async () => {
        try {
            if (!permissionGranted) {
                const permission = await NotificationService.requestPermissions();
                if (!permission) {
                    Alert.alert(
                        'Permissions refusées',
                        'Impossible d\'envoyer une notification de test sans autorisation.'
                    );
                    return;
                }
                setPermissionGranted(true);
            }

            await NotificationService.scheduleTestNotification();
            Alert.alert(
                'Notification de test programmée',
                'Vous recevrez une notification de test dans 15 secondes.'
            );
        } catch (error) {
            console.error('Error scheduling test notification:', error);
            Alert.alert('Erreur', 'Impossible de programmer la notification de test.');
        }
    };

    const handleBack = () => {
        router.replace('/profile');
    };

    // Afficher un indicateur de chargement pendant l'initialisation
    if (isLoading) {
        return (
            <PageTransitionWrapper animationType="slide" duration={300}>
                <ScreenBackground>
                    <View style={[styles.container, styles.loadingContainer]}>
                        <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
                            Chargement des notifications...
                        </Text>
                    </View>
                </ScreenBackground>
            </PageTransitionWrapper>
        );
    }

    return (
        <PageTransitionWrapper animationType="slide" duration={300}>
            <ScreenBackground>
                <View style={[styles.container]}>
                    {/* Header avec bouton retour */}
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ChevronLeft size={24} color={isDarkBackground ? '#FFFFFF' : '#181818'} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: isDarkBackground ? '#FFFFFF' : '#181818' }]}>
                            Customise reminders
                        </Text>
                        <View style={styles.headerSpacer} />
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* All notifications - Séparé */}
                        <View style={[styles.allNotificationsContainer, { backgroundColor: theme.colors.reminders.background }]}>
                            <View style={styles.notificationContent}>
                                <Text style={[styles.notificationTitle, { color: theme.colors.text.secondary }]}>
                                    All notifications
                                </Text>
                            </View>
                            <Switch
                                value={preferences.allNotifications}
                                onValueChange={handleAllNotificationsToggle}
                                trackColor={{ false: '#ffffff', true: isDarkBackground ? '#A92359' : '#7E0F3B' }}
                                thumbColor={'#ffffff'}
                                style={styles.switch}
                            />
                        </View>

                        {/* Bloc des autres notifications */}
                        <View style={[styles.notificationsBlock, { backgroundColor: theme.colors.reminders.background }]}>
                            {/* Morning & Evening Adhkar */}
                            <View style={styles.notificationBlockItem}>
                                <View style={styles.notificationContent}>
                                    <View style={styles.notificationHeader}>
                                        <Text style={styles.emoji}>🌅</Text>
                                        <Text style={[styles.notificationTitle, { color: theme.colors.text.secondary }]}>
                                            Morning & Evening Adhkar
                                        </Text>
                                    </View>
                                    <Text style={[styles.notificationDescription, { color: theme.colors.text.primary }]}>
                                        Your daily shield of protection. We'll remind you when it's time.
                                    </Text>
                                    <Text style={[styles.notificationTime, { color: theme.colors.text.primary }]}>
                                        7:20 AM & 6:30 PM daily
                                    </Text>
                                </View>
                                <Switch
                                    value={preferences.morningEvening}
                                    onValueChange={(value) => handleIndividualToggle('morningEvening', value)}
                                    trackColor={{ false: '#ffffff', true: isDarkBackground ? '#A92359' : '#7E0F3B' }}
                                    thumbColor={'#ffffff'}
                                    style={styles.switch}
                                />
                            </View>

                            {/* Séparateur */}
                            <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

                            {/* Jummah */}
                            <View style={styles.notificationBlockItem}>
                                <View style={styles.notificationContent}>
                                    <View style={styles.notificationHeader}>
                                        <Text style={styles.emoji}>🕌</Text>
                                        <Text style={[styles.notificationTitle, { color: theme.colors.text.secondary }]}>
                                            Jummah
                                        </Text>
                                    </View>
                                    <Text style={[styles.notificationDescription, { color: theme.colors.text.primary }]}>
                                        A Friday nudge to send salawat and read Surah Al-Kahf.
                                    </Text>
                                    <Text style={[styles.notificationTime, { color: theme.colors.text.primary }]}>
                                        Fridays at 10:50 AM
                                    </Text>
                                </View>
                                <Switch
                                    value={preferences.jummah}
                                    onValueChange={(value) => handleIndividualToggle('jummah', value)}
                                    trackColor={{ false: '#ffffff', true: isDarkBackground ? '#A92359' : '#7E0F3B' }}
                                    thumbColor={'#ffffff'}
                                    style={styles.switch}
                                />
                            </View>

                            {/* Séparateur */}
                            <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

                            {/* Daily Goals */}
                            <View style={styles.notificationBlockItem}>
                                <View style={styles.notificationContent}>
                                    <View style={styles.notificationHeader}>
                                        <Text style={styles.emoji}>🎯</Text>
                                        <Text style={[styles.notificationTitle, { color: theme.colors.text.secondary }]}>
                                            Daily Goals
                                        </Text>
                                    </View>
                                    <Text style={[styles.notificationDescription, { color: theme.colors.text.primary }]}>
                                        A timely reminder to help you reach your spiritual goals.
                                    </Text>
                                    <Text style={[styles.notificationTime, { color: theme.colors.text.primary }]}>
                                        Daily at 4:00 PM
                                    </Text>
                                </View>
                                <Switch
                                    value={preferences.dailyGoals}
                                    onValueChange={(value) => handleIndividualToggle('dailyGoals', value)}
                                    trackColor={{ false: '#ffffff', true: isDarkBackground ? '#A92359' : '#7E0F3B' }}
                                    thumbColor={'#ffffff'}
                                    style={styles.switch}
                                />
                            </View>
                        </View>

                        {/* Message de contrôle */}
                        <View style={styles.controlMessage}>
                            <Text style={[styles.controlText, { color: theme.colors.text.primary }]}>
                                You're in control. Turn these on or off anytime - no pressure.
                            </Text>
                        </View>

                        {/* Bouton de test */}
                        <TouchableOpacity
                            style={[styles.testButton, { backgroundColor: isDarkBackground ? '#A92359' : '#7E0F3B' }]}
                            onPress={handleTestNotification}
                        >
                            <Text style={styles.testButtonText}>
                                Send Test Notification (15s)
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.bottomSpacing} />
                    </ScrollView>
                </View>
            </ScreenBackground>
        </PageTransitionWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        fontFamily: 'Sofia-Pro-Light',
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
    },

    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: 'Sofia-Pro-Regular',
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },

    content: {
        flex: 1,
        paddingHorizontal: 24,
    },

    titleContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },

    title: {
        fontFamily: 'Classico',
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontFamily: 'Sofia-Pro-Light',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    // All notifications - séparé
    allNotificationsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    // Bloc unifié pour les autres notifications
    notificationsBlock: {
        borderRadius: 16,
        marginBottom: 32,
        overflow: 'hidden',
    },
    notificationBlockItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        justifyContent: 'space-between',
    },
    separator: {
        height: 1,
        marginHorizontal: 20,
        opacity: 0.1,
    },
    notificationContent: {
        flex: 1,
        marginRight: 16,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    emoji: {
        fontSize: 20,
        marginRight: 12,
    },
    notificationTitle: {
        fontFamily: 'Sofia-Pro',
        fontSize: 16,
        fontWeight: '500',
    },
    notificationDescription: {
        fontFamily: 'Sofia-Pro-Light',
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 32, // Aligné avec le titre (emoji + margin)
        marginBottom: 4,
    },
    notificationTime: {
        fontFamily: 'Sofia-Pro-Light',
        fontSize: 12,
        marginLeft: 32,
        opacity: 0.7,
        fontStyle: 'italic',
    },
    switch: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    },
    controlMessage: {
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    controlText: {
        fontFamily: 'Sofia-Pro-Light',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    testButton: {
        marginHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    testButtonText: {
        fontFamily: 'Sofia-Pro',
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    continueButton: {
        marginHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    continueButtonText: {
        fontFamily: 'Sofia-Pro',
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    bottomSpacing: {
        height: 100,
    },
});