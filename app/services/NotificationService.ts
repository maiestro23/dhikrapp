import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationContent {
  title: string;
  body: string;
}

export interface NotificationSchedule {
  type: 'morningEvening' | 'jummah' | 'dailyGoals';
  hour: number;
  minute: number;
  weekday?: number; // 1 = lundi, 6 = vendredi, 0 = dimanche
  content: NotificationContent[];
}

// Données des notifications basées sur le fichier Excel
const NOTIFICATION_SCHEDULES: NotificationSchedule[] = [
  {
    type: 'morningEvening',
    hour: 7,
    minute: 20,
    content: [
      {
        title: '☀️ Morning Adhkar',
        body: 'Start your week with Khair — 2 minutes of morning adhkar fill the day with barakah.'
      },
      {
        title: '🎁 Blessings Inside',
        body: '"Remember Allah often so you may be successful." (62:10) Begin with morning adhkar!'
      },
      {
        title: '⏱️ 2 min to Barakah...',
        body: 'It\'s time for your morning adhkar. Protection and blessings await...'
      },
      {
        title: '🛡️ Your shield is ready',
        body: 'Guard your day with morning adhkar — angels surround those who remember Allah.'
      },
      {
        title: '🕌 Jummah Mubarak',
        body: 'Begin your day with Morning Adhkar. Extra mercy, extra reward, extra light.'
      },
      {
        title: '🌅 Morning Adhkar',
        body: 'Just 2 minutes of dhikr can change the course of your day. Tap to begin!'
      },
      {
        title: '🤲 Gain Allah\'s Remembrance in 2 minutes',
        body: 'Allah says: "So remember Me; I will remember you." (2:152) Tap for Morning Adhkar.'
      }
    ]
  },
  {
    type: 'morningEvening',
    hour: 18,
    minute: 30,
    content: [
      {
        title: '🌙 Night Protection',
        body: 'Just 2 minutes for your evening adhkar. End with protection!'
      },
      {
        title: '🌇 Evening Adhkar',
        body: 'Thank Allah for today\'s blessings — this is your moment of peace 🙏'
      },
      {
        title: '🌅 Sunnah at Sunset',
        body: 'The Prophet ﷺ never missed evening adhkar. Tap to follow his sunnah!'
      },
      {
        title: 'Sleep in Peace 😴',
        body: 'Nightmares? Just 2 mins of evening adhkar shields you till dawn.'
      },
      {
        title: '📿 Friday Evening Adhkar',
        body: 'End this blessed Friday with Khair — the gates of reward are still open.'
      },
      {
        title: '🧘‍♀️ Weekend Wind-Down',
        body: 'Rest your mind and soul with evening adhkar. The perfect way to end your day.'
      },
      {
        title: '😐 Anxious? Stressed? Restless?',
        body: '"In the remembrance of Allah do hearts find rest." (3:28) End tonight with peace'
      }
    ]
  },
  {
    type: 'jummah',
    hour: 10,
    minute: 50,
    weekday: 5, // Vendredi
    content: [
      {
        title: 'Salawat Reminder 🤲',
        body: 'Tap to send Salawat — the Prophet ﷺ said it brings extra rizq 🌟'
      }
    ]
  },
  {
    type: 'dailyGoals',
    hour: 16,
    minute: 0,
    content: [
      {
        title: '😕 Need an iman boost?',
        body: 'Say \'La ilaha illa Allah\' until your heart softens — you\'re close to your goal!'
      },
      {
        title: 'Take a tasbih break 📿',
        body: 'Pause for a moment with a quick dhikr break. Almost there ✨'
      },
      {
        title: '📲 Doomscroll vs Dhikr scroll',
        body: 'Swap the scroll for dhikr and finish strong ✨'
      },
      {
        title: '⏱ Istighfar Pending...',
        body: 'Complete today\'s goal with istighfar — the key to inner peace 🤲'
      },
      {
        title: '🎯 Daily Goal',
        body: 'Masha\'Allah, almost done! Finish with tasbih for extra barakah 🌙'
      },
      {
        title: '🕊️ Complete your daily goal',
        body: '"Most beloved deeds are consistent, even if small" — keep going, Bismillah!'
      },
      {
        title: '🤲 End your week strong',
        body: 'Your daily goal awaits. Keep your streak alive!'
      }
    ]
  }
];

class NotificationService {
  
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  }

  async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async cancelNotificationsByType(type: string): Promise<void> {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.identifier.includes(type)) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  }

  private getRandomContent(contents: NotificationContent[]): NotificationContent {
    const randomIndex = Math.floor(Math.random() * contents.length);
    return contents[randomIndex];
  }

  private getNextScheduleDate(hour: number, minute: number, weekday?: number): Date {
    const now = new Date();
    const scheduleDate = new Date();
    
    scheduleDate.setHours(hour, minute, 0, 0);
    
    if (weekday !== undefined) {
      // Pour les notifications hebdomadaires (comme Jummah)
      const currentDay = now.getDay();
      const daysUntilTarget = (weekday - currentDay + 7) % 7;
      
      if (daysUntilTarget === 0 && now > scheduleDate) {
        // Si c'est aujourd'hui mais l'heure est passée, programmer pour la semaine prochaine
        scheduleDate.setDate(scheduleDate.getDate() + 7);
      } else {
        scheduleDate.setDate(scheduleDate.getDate() + daysUntilTarget);
      }
    } else {
      // Pour les notifications quotidiennes
      if (now > scheduleDate) {
        // Si l'heure est passée aujourd'hui, programmer pour demain
        scheduleDate.setDate(scheduleDate.getDate() + 1);
      }
    }
    
    return scheduleDate;
  }

  async scheduleNotification(schedule: NotificationSchedule): Promise<void> {
    const content = this.getRandomContent(schedule.content);
    const triggerDate = this.getNextScheduleDate(schedule.hour, schedule.minute, schedule.weekday);
    
    const identifier = `${schedule.type}_${triggerDate.getTime()}`;
    
    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: content.title,
        body: content.body,
        sound: 'default',
      },
      trigger: triggerDate,
    });

    // Programmer la prochaine occurrence si c'est récurrent
    if (schedule.weekday !== undefined) {
      // Notification hebdomadaire - programmer la semaine suivante
      const nextWeekDate = new Date(triggerDate);
      nextWeekDate.setDate(nextWeekDate.getDate() + 7);
      
      const nextContent = this.getRandomContent(schedule.content);
      await Notifications.scheduleNotificationAsync({
        identifier: `${schedule.type}_${nextWeekDate.getTime()}`,
        content: {
          title: nextContent.title,
          body: nextContent.body,
          sound: 'default',
        },
        trigger: nextWeekDate,
      });
    } else {
      // Notification quotidienne - programmer le jour suivant
      const nextDayDate = new Date(triggerDate);
      nextDayDate.setDate(nextDayDate.getDate() + 1);
      
      const nextContent = this.getRandomContent(schedule.content);
      await Notifications.scheduleNotificationAsync({
        identifier: `${schedule.type}_${nextDayDate.getTime()}`,
        content: {
          title: nextContent.title,
          body: nextContent.body,
          sound: 'default',
        },
        trigger: nextDayDate,
      });
    }
  }

  async scheduleNotificationsForType(type: 'morningEvening' | 'jummah' | 'dailyGoals'): Promise<void> {
    const schedules = NOTIFICATION_SCHEDULES.filter(s => s.type === type);
    
    for (const schedule of schedules) {
      await this.scheduleNotification(schedule);
    }
  }

  async scheduleTestNotification(): Promise<void> {
    const morningSchedule = NOTIFICATION_SCHEDULES.find(s => s.type === 'morningEvening');
    if (!morningSchedule) return;

    const content = this.getRandomContent(morningSchedule.content);
    const triggerDate = new Date();
    triggerDate.setSeconds(triggerDate.getSeconds() + 15); // Dans 15 secondes

    await Notifications.scheduleNotificationAsync({
      identifier: 'test_notification',
      content: {
        title: `🧪 TEST: ${content.title}`,
        body: content.body,
        sound: 'default',
      },
      trigger: triggerDate,
    });
  }

  async getAllScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}

export default new NotificationService();