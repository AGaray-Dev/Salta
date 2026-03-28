import { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { colors } from "../theme";

const calculateStreak = (completions) => {
  if (!completions || completions.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDates = [...new Set(completions.map((c) => c.completed_date))]
    .sort()
    .reverse();

  if (uniqueDates.length === 0) return 0;

  let streak = 0;
  let checkDate = new Date(today);

  for (const dateStr of uniqueDates) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    const diffDays = Math.round((checkDate - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0 || diffDays === 1) {
      streak++;
      checkDate = date;
    } else {
      break;
    }
  }
  return streak;
};

export default function StreakCounter({ completions }) {
  const scale = useRef(new Animated.Value(1)).current;
  const streak = calculateStreak(completions);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.2,
        damping: 4,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [streak]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.streakBadge, { transform: [{ scale }] }]}>
        <Text style={styles.flame}>🔥</Text>
        <Text style={styles.count}>{streak}</Text>
      </Animated.View>
      <Text style={styles.label}>day streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  flame: {
    fontSize: 20,
  },
  count: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
