import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export function useCompletions(userId) {
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchCompletions();
  }, [userId]);

  const fetchCompletions = async () => {
    setLoading(true);

    // Get completions for the past 365 days
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const { data, error } = await supabase
      .from("completions")
      .select("completed_date, habit_id")
      .eq("user_id", userId)
      .gte("completed_date", oneYearAgo.toISOString().split("T")[0])
      .order("completed_date", { ascending: true });

    if (error) {
      console.error("Error fetching completions:", error);
    } else {
      setCompletions(data);
    }
    setLoading(false);
  };

  // Count completions per date — this powers the heatmap
  const getCountByDate = () => {
    return completions.reduce((acc, row) => {
      const date = row.completed_date;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  };

  // Check if a specific habit is done today
  const isCompletedToday = (habitId) => {
    const today = new Date().toISOString().split("T")[0];
    return completions.some(
      (c) => c.habit_id === habitId && c.completed_date === today,
    );
  };

  // Mark a habit complete for today
  const markComplete = async (habitId) => {
    const today = new Date().toISOString().split("T")[0];

    // Optimistic update — update UI instantly before Supabase responds
    const newCompletion = { habit_id: habitId, completed_date: today };
    setCompletions((prev) => [...prev, newCompletion]);

    const { error } = await supabase.from("completions").insert([
      {
        habit_id: habitId,
        user_id: userId,
        completed_date: today,
      },
    ]);

    if (error) {
      // If it fails, roll back the optimistic update
      console.error("Error marking complete:", error);
      setCompletions((prev) =>
        prev.filter(
          (c) => !(c.habit_id === habitId && c.completed_date === today),
        ),
      );
      return false;
    }
    return true;
  };

  // Unmark a habit for today
  const markIncomplete = async (habitId) => {
    const today = new Date().toISOString().split("T")[0];

    // Optimistic update
    setCompletions((prev) =>
      prev.filter(
        (c) => !(c.habit_id === habitId && c.completed_date === today),
      ),
    );

    const { error } = await supabase
      .from("completions")
      .delete()
      .eq("habit_id", habitId)
      .eq("user_id", userId)
      .eq("completed_date", today);

    if (error) {
      console.error("Error marking incomplete:", error);
      await fetchCompletions(); // Refetch to restore correct state
      return false;
    }
    return true;
  };

  return {
    completions,
    loading,
    getCountByDate,
    isCompletedToday,
    markComplete,
    markIncomplete,
    fetchCompletions,
  };
}
