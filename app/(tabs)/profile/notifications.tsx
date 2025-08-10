import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Dimensions,
    Platform
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { ScreenBackground } from '@/components/ScreenBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';

const { width } = Dimensions.get('window');

export default function NotificationsScreen() {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    // États pour les toggles de notifications
    const [allNotifications, setAllNotifications] = useState(false);
    const [morningEvening, setMorningEvening] = useState(true);
    const [jummah, setJummah] = useState(false);
    const [dailyGoals, setDailyGoals] = useState(true);

    // Fonction pour gérer le toggle "All notifications"
    const handleAllNotificationsToggle = (value: boolean) => {
        setAllNotifications(value);
        // Mettre toutes les notifications au même état
        setMorningEvening(value);
        setJummah(value);
        setDailyGoals(value);
    };

    // Fonction pour gérer les toggles individuels
    const handleIndividualToggle = (
        setter: React.Dispatch<React.SetStateAction<boolean>>,
        value: boolean
    ) => {
        setter(value);

        // Vérifier si toutes les notifications individuelles sont activées
        const newMorningEvening = setter === setMorningEvening ? value : morningEvening;
        const newJummah = setter === setJummah ? value : jummah;
        const newDailyGoals = setter === setDailyGoals ? value : dailyGoals;

        // Mettre à jour "All notifications" selon l'état des notifications individuelles
        const allActive = newMorningEvening && newJummah && newDailyGoals;
        setAllNotifications(allActive);
    };

    const handleGoBack = () => {
        router.replace('/profile');
    };

    return (
        <PageTransitionWrapper animationType="slide" duration={300}>
            <ScreenBackground>
                <View style={[styles.container]}>
                    {/* Header avec bouton retour */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleGoBack}
                        >
                            <ChevronLeft size={24} color={theme.colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Titre principal */}
                        <View style={styles.titleContainer}>
                            <Text style={[styles.title, { color: theme.colors.text.secondary }]}>
                                Customise reminders
                            </Text>
                            <Text style={[styles.subtitle, { color: theme.colors.text.primary }]}>
                                Gentle nudges through the day to help you pause and reconnect.
                            </Text>
                        </View>

                        {/* All notifications - Séparé */}
                        <View style={[styles.allNotificationsContainer, { backgroundColor: theme.colors.card }]}>
                            <View style={styles.notificationContent}>
                                <Text style={[styles.notificationTitle, { color: theme.colors.text.secondary }]}>
                                    All notifications
                                </Text>
                            </View>
                            <Switch
                                value={allNotifications}
                                onValueChange={handleAllNotificationsToggle}
                                trackColor={{ false: '#E5E5E5', true: '#7E0F3B' }}
                                thumbColor={allNotifications ? '#ffffff' : '#ffffff'}
                                ios_backgroundColor="#E5E5E5"
                                style={styles.switch}
                            />
                        </View>

                        {/* Bloc des autres notifications */}
                        <View style={[styles.notificationsBlock, { backgroundColor: theme.colors.card }]}>
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
                                </View>
                                <Switch
                                    value={morningEvening}
                                    onValueChange={(value) => handleIndividualToggle(setMorningEvening, value)}
                                    trackColor={{ false: '#E5E5E5', true: '#7E0F3B' }}
                                    thumbColor={morningEvening ? '#ffffff' : '#ffffff'}
                                    ios_backgroundColor="#E5E5E5"
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
                                </View>
                                <Switch
                                    value={jummah}
                                    onValueChange={(value) => handleIndividualToggle(setJummah, value)}
                                    trackColor={{ false: '#E5E5E5', true: '#7E0F3B' }}
                                    thumbColor={jummah ? '#ffffff' : '#ffffff'}
                                    ios_backgroundColor="#E5E5E5"
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
                                </View>
                                <Switch
                                    value={dailyGoals}
                                    onValueChange={(value) => handleIndividualToggle(setDailyGoals, value)}
                                    trackColor={{ false: '#E5E5E5', true: '#7E0F3B' }}
                                    thumbColor={dailyGoals ? '#ffffff' : '#ffffff'}
                                    ios_backgroundColor="#E5E5E5"
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

                        {/* Bouton Let's go */}
                        <TouchableOpacity
                            style={[styles.continueButton, { backgroundColor: '#7E0F3B' }]}
                            onPress={handleGoBack}
                        >
                            <Text style={styles.continueButtonText}>Let's go</Text>
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
    header: {
        paddingHorizontal: 24,
        //paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
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