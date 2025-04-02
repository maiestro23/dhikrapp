import { useProgressStore } from '../stores/progressStore';

export function useProgress() {
  const {
    totalCount,
    dailyProgress,
    currentStreak,
    dailyGoal,
    incrementCount,
  } = useProgressStore();

  const getTodayProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    return dailyProgress.find(p => p.date === today)?.count || 0;
  };

  const getTotalMinutes = () => {
    return dailyProgress.reduce((total, day) => total + Math.floor(day.timeSpent / 60), 0);
  };

  const getGoalProgress = () => {
    if (!dailyGoal) return 0;
    const todayCount = getTodayProgress();
    return Math.ceil((todayCount / dailyGoal) * 100);
  };

  const getRemainingToGoal = () => {
    if (!dailyGoal) return 0;
    const todayCount = getTodayProgress();
    return Math.max(dailyGoal - todayCount, 0);
  };

  return {
    totalCount,
    currentStreak,
    totalMinutes: getTotalMinutes(),
    goalProgress: getGoalProgress(),
    remainingToGoal: getRemainingToGoal(),
    incrementCount,
  };
}