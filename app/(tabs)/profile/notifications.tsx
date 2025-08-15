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
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';
import { useProgressStore } from '@/stores/progressStore';
import notificationsHandler, {
    initializeNotifications,
    updateNotificationPreferences,
    getNotificationPreferences
} from '@/components/NotificationsHandler';


const { width } = Dimensions.get('window');

export default function NotificationsScreen() {

    const insets = useSafeAreaInsets();
    const progressStore = useProgressStore();

    // États pour les toggles de notifications
    const [allNotifications, setAllNotifications] = useState(false);
    const [morningEvening, setMorningEvening] = useState(true);
    const [jummah, setJummah] = useState(false);
    const [dailyGoals, setDailyGoals] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const { theme, isDarkBackground } = useTheme();

    // Charger les préférences au montage du composant
    useEffect(() => {
        loadNotificationPreferences();
    }, []);

    const loadNotificationPreferences = async () => {
        try {
            setIsLoading(true);

            // Initialiser le gestionnaire de notifications
            const initialized = await initializeNotifications();

            if (!initialized) {
                Alert.alert(
                    'Notifications désactivées',
                    'Les notifications ne peuvent pas être activées. Veuillez vérifier les paramètres de votre appareil.',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Charger les préférences sauvegardées
            const preferences = getNotificationPreferences();
            setAllNotifications(preferences.allNotifications);
            setMorningEvening(preferences.morningEvening);
            setJummah(preferences.jummah);
            setDailyGoals(preferences.dailyGoals);

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

    // Fonction pour sauvegarder et appliquer les préférences
    const savePreferences = async (newPreferences: any) => {
        try {
            await updateNotificationPreferences(newPreferences, useProgressStore);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des préférences:', error);
            Alert.alert(
                'Erreur',
                'Impossible de sauvegarder les préférences de notifications.',
                [{ text: 'OK' }]
            );
        }
    };

    // Fonction pour gérer le toggle "All notifications"
    const handleAllNotificationsToggle = async (value: boolean) => {
        setAllNotifications(value);

        // Mettre toutes les notifications au même état
        setMorningEvening(value);
        setJummah(value);
        setDailyGoals(value);

        // Sauvegarder les préférences
        await savePreferences({
            allNotifications: value,
            morningEvening: value,
            jummah: value,
            dailyGoals: value,
        });
    };

    // Fonction pour gérer les toggles individuels
    const handleIndividualToggle = async (
        setter: React.Dispatch<React.SetStateAction<boolean>>,
        value: boolean,
        key: string
    ) => {
        setter(value);

        // Calculer le nouvel état de toutes les notifications individuelles
        const newMorningEvening = key === 'morningEvening' ? value : morningEvening;
        const newJummah = key === 'jummah' ? value : jummah;
        const newDailyGoals = key === 'dailyGoals' ? value : dailyGoals;

        // Mettre à jour "All notifications" selon l'état des notifications individuelles
        const allActive = newMorningEvening && newJummah && newDailyGoals;
        setAllNotifications(allActive);

        // Sauvegarder les préférences
        await savePreferences({
            allNotifications: allActive,
            morningEvening: newMorningEvening,
            jummah: newJummah,
            dailyGoals: newDailyGoals,
        });
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


                    {/* Titre principal */}
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
                                value={allNotifications}
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
                                        Your daily shield of protection.{'\n'}We'll remind you when it's time.
                                    </Text>
                                    <Text style={[styles.notificationTime, { color: theme.colors.text.primary }]}>
                                        7:00 AM & 6:30 PM daily
                                    </Text>
                                </View>
                                <Switch
                                    value={morningEvening}
                                    onValueChange={(value) => handleIndividualToggle(setMorningEvening, value, 'morningEvening')}
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
                                        A Friday nudge to send salawat{'\n'}and read Surah Al-Kahf.
                                    </Text>
                                    <Text style={[styles.notificationTime, { color: theme.colors.text.primary }]}>
                                        Fridays at 12:00 PM
                                    </Text>
                                </View>
                                <Switch
                                    value={jummah}
                                    onValueChange={(value) => handleIndividualToggle(setJummah, value, 'jummah')}
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
                                        A timely reminder to help you{'\n'}reach your spiritual goals.
                                    </Text>
                                    <Text style={[styles.notificationTime, { color: theme.colors.text.primary }]}>
                                        Daily at 8:00 PM
                                    </Text>
                                </View>
                                <Switch
                                    value={dailyGoals}
                                    onValueChange={(value) => handleIndividualToggle(setDailyGoals, value, 'dailyGoals')}
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