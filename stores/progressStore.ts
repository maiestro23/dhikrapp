import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DailyProgress {
  count: number;
  date: string;
  timeSpent: number; // in seconds
}

interface ProgressState {
  totalCount: number;
  dailyProgress: DailyProgress[];
  currentStreak: number;
  lastActiveDate: string | null;
  dailyGoal: number | null;
  
  // Actions
  incrementCount: () => void;
  addTimeSpent: (seconds: number) => void;
  setDailyGoal: (goal: number) => void;
  resetDaily: () => void;
}

const getTodayKey = () => new Date().toISOString().split('T')[0];

const calculateStreak = (dailyProgress: DailyProgress[], lastActiveDate: string | null): number => {
  if (!lastActiveDate) return 0;
  
  const today = new Date();
  const lastActive = new Date(lastActiveDate);
  const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays > 1) return 0;
  
  let streak = 1;
  let currentDate = new Date(lastActiveDate);
  
  for (let i = dailyProgress.length - 2; i >= 0; i--) {
    const progressDate = new Date(dailyProgress[i].date);
    const dayDiff = Math.floor((currentDate.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      streak++;
      currentDate = progressDate;
    } else {
      break;
    }
  }
  
  return streak;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      totalCount: 0,
      dailyProgress: [],
      currentStreak: 0,
      lastActiveDate: null,
      dailyGoal: null,

      incrementCount: () => {
        const today = getTodayKey();
        const currentProgress = get().dailyProgress;
        const todayProgress = currentProgress.find(p => p.date === today);
        
        if (todayProgress) {
          const updatedProgress = currentProgress.map(p =>
            p.date === today ? { ...p, count: p.count + 1 } : p
          );
          set(state => ({
            totalCount: state.totalCount + 1,
            dailyProgress: updatedProgress,
            lastActiveDate: today,
          }));
        } else {
          set(state => ({
            totalCount: state.totalCount + 1,
            dailyProgress: [...state.dailyProgress, { date: today, count: 1, timeSpent: 0 }],
            lastActiveDate: today,
          }));
        }
        
        // Update streak
        set(state => ({
          currentStreak: calculateStreak(state.dailyProgress, state.lastActiveDate),
        }));
      },

      addTimeSpent: (seconds: number) => {
        const today = getTodayKey();
        const currentProgress = get().dailyProgress;
        const todayProgress = currentProgress.find(p => p.date === today);
        
        if (todayProgress) {
          const updatedProgress = currentProgress.map(p =>
            p.date === today ? { ...p, timeSpent: p.timeSpent + seconds } : p
          );
          set({ dailyProgress: updatedProgress });
        } else {
          set(state => ({
            dailyProgress: [...state.dailyProgress, { date: today, count: 0, timeSpent: seconds }],
          }));
        }
      },

      setDailyGoal: (goal: number) => {
        set({ dailyGoal: goal });
      },

      resetDaily: () => {
        const today = getTodayKey();
        set(state => ({
          dailyProgress: [...state.dailyProgress, { date: today, count: 0, timeSpent: 0 }],
        }));
      },
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);