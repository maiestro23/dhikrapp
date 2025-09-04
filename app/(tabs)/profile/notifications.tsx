import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
    StyleSheet,
    Alert,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import NotificationService from '@/app/services/NotificationService';
import NotificationStorage, { NotificationPreferences } from '@/stores/NotificationStorage';




interface NotificationsScreenProps {
    onBack?: () => void;
    // Ajoutez d'autres props si nécessaire
}

export default function NotificationsScreen({ onBack }: NotificationsScreenProps) {
    // États pour les préférences de notifications
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        allNotifications: false,
        morningEvening: false,
        jummah: false,
        dailyGoals: false,
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [permissionGranted, setPermissionGranted] = useState(false);

    // Remplacez par votre logique de thème
    const theme = {
        colors: {
            reminders: { background: '#F5F5F5' },
            text: { primary: '#333333', secondary: '#666666' },
            border: '#E0E0E0'
        }
    };
    const isDarkBackground = false; // Remplacez par votre logique

    useEffect(() => {
        initializeNotifications();
    }, []);

    const initializeNotifications = async () => {
        try {
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
            console.error('Error initializing notifications:', error);
            Alert.alert('Erreur', 'Impossible de charger les préférences de notifications.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
        // Ou votre logique de navigation
    };

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

            const updatedPreferences = await NotificationStorage.updatePreference(key, value);
            
            // Mettre à jour le switch "All notifications" en fonction des préférences individuelles
            const allIndividualEnabled = NotificationStorage.areAllIndividualNotificationsEnabled(updatedPreferences);
            const allIndividualDisabled = NotificationStorage.areAllIndividualNotificationsDisabled(updatedPreferences);
            
            if (allIndividualEnabled && !updatedPreferences.allNotifications) {
                updatedPreferences.allNotifications = true;
                await NotificationStorage.updatePreference('allNotifications', true);
            } else if (allIndividualDisabled && updatedPreferences.allNotifications) {
                updatedPreferences.allNotifications = false;
                await NotificationStorage.updatePreference('allNotifications', false);
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

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
                    Chargement des préférences...
                </Text>
            </View>
        );
    }

    return (
        // Remplacez PageTransitionWrapper et ScreenBackground par vos composants ou <View>
        <View style={styles.container}>
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
        </View>
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