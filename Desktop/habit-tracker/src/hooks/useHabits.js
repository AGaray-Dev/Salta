import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export function useHabits(userId) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load habits from Supabase
  useEffect(() => {
    if (!userId) return;
    fetchHabits();
  }, [userId]);

  const fetchHabits = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching habits:", error);
    else setHabits(data);
    setLoading(false);
  };

  // Add a new habit
  const addHabit = async (name, color) => {
    const { data, error } = await supabase
      .from("habits")
      .insert([{ name, color, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error("Error adding habit:", error);
      return false;
    }
    setHabits((prev) => [data, ...prev]);
    return true;
  };

  // Delete a habit
  const deleteHabit = async (habitId) => {
    const { error } = await supabase
      .from("habits")
      .update({ is_active: false })
      .eq("id", habitId);

    if (error) {
      console.error("Error deleting habit:", error);
      return false;
    }
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    return true;
  };

  return { habits, loading, addHabit, deleteHabit, fetchHabits };
}
