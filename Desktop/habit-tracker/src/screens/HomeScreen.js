import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { useHabits } from "../hooks/useHabits";
import { useCompletions } from "../hooks/useCompletions";
import AddHabitModal from "../components/AddHabitModal";
import HeatmapGrid from "../components/HeatmapGrid";
import AnimatedCheckButton from "../components/AnimatedCheckButton";
import ProgressRing from "../components/ProgressRing";
import StreakCounter from "../components/StreakCounter";
import CompletionCelebration from "../components/CompletionCelebration";
import { colors, typography } from "../theme";

export default function HomeScreen({ route }) {
  const userId = route?.params?.userId;
  const {
    habits,
    loading: habitsLoading,
    addHabit,
    deleteHabit,
  } = useHabits(userId);
  const {
    completions,
    loading: completionsLoading,
    getCountByDate,
    isCompletedToday,
    markComplete,
    markIncomplete,
  } = useCompletions(userId);

  const [modalVisible, setModalVisible] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const prevCompletedCount = useRef(0);

  // Check if all habits are done — trigger celebration
  useEffect(() => {
    if (habits.length === 0) return;

    const completedToday = habits.filter((h) => isCompletedToday(h.id)).length;

    if (
      completedToday === habits.length &&
      completedToday > prevCompletedCount.current
    ) {
      setCelebrating(true);
    }

    prevCompletedCount.current = completedToday;
  }, [completions, habits]);

  const handleToggleComplete = async (habit) => {
    if (isCompletedToday(habit.id)) {
      await markIncomplete(habit.id);
    } else {
      await markComplete(habit.id);
    }
  };

  const handleDelete = (habit) => {
    Alert.alert(
      "Delete habit?",
      `"${habit.name}" will be removed. Your history is preserved.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteHabit(habit.id),
        },
      ],
    );
  };

  const completedToday = habits.filter((h) => isCompletedToday(h.id)).length;
  const loading = habitsLoading || completionsLoading;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {getGreeting()}</Text>
            <Text style={styles.title}>My Habits</Text>
          </View>
          <View style={styles.headerRight}>
            <StreakCounter completions={completions} />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress summary */}
        {habits.length > 0 && (
          <View style={styles.progressCard}>
            <ProgressRing completed={completedToday} total={habits.length} />
            <View style={styles.progressText}>
              <Text style={styles.progressTitle}>
                {completedToday === habits.length
                  ? "All done! 🎉"
                  : `${completedToday} of ${habits.length} done`}
              </Text>
              <Text style={styles.progressSubtitle}>
                {completedToday === habits.length
                  ? "You crushed today"
                  : `${habits.length - completedToday} habit${habits.length - completedToday !== 1 ? "s" : ""} remaining`}
              </Text>
            </View>
          </View>
        )}

        {/* Heatmap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your year</Text>
          <View style={styles.heatmapCard}>
            {completionsLoading ? (
              <ActivityIndicator
                color={colors.primary}
                style={{ margin: 20 }}
              />
            ) : (
              <HeatmapGrid countByDate={getCountByDate()} />
            )}
          </View>
        </View>

        {/* Today's habits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ margin: 20 }} />
          ) : habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🌱</Text>
              <Text style={styles.emptyTitle}>No habits yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap + to add your first habit
              </Text>
            </View>
          ) : (
            habits.map((habit) => {
              const done = isCompletedToday(habit.id);
              return (
                <TouchableOpacity
                  key={habit.id}
                  style={[styles.habitCard, done && styles.habitCardDone]}
                  onLongPress={() => handleDelete(habit)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[styles.colorDot, { backgroundColor: habit.color }]}
                  />
                  <View style={styles.habitInfo}>
                    <Text
                      style={[styles.habitName, done && styles.habitNameDone]}
                    >
                      {habit.name}
                    </Text>
                    <Text style={styles.habitStatus}>
                      {done ? "✓ Done today" : "Not done yet"}
                    </Text>
                  </View>
                  <AnimatedCheckButton
                    done={done}
                    color={habit.color}
                    onPress={() => handleToggleComplete(habit)}
                  />
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => supabase.auth.signOut()}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Celebration overlay */}
      <CompletionCelebration
        visible={celebrating}
        onDone={() => setCelebrating(false)}
      />

      {/* Add habit modal */}
      <AddHabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addHabit}
      />
    </View>
  );
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.base,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 48,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerRight: {
    alignItems: "center",
    gap: 8,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "300",
    lineHeight: 28,
  },
  progressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressText: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  heatmapCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 24,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  habitCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  habitCardDone: {
    opacity: 0.55,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  habitNameDone: {
    textDecorationLine: "line-through",
    color: colors.textMuted,
  },
  habitStatus: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logoutButton: {
    marginHorizontal: 24,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  logoutText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
});
