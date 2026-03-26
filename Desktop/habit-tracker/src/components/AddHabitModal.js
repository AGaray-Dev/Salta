import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const COLORS = [
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f97316", // orange
  "#ec4899", // pink
];

export default function AddHabitModal({ visible, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const success = await onAdd(name.trim(), selectedColor);
    if (success) {
      setName("");
      setSelectedColor(COLORS[0]);
      onClose();
    }
    setLoading(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.inner}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>New Habit</Text>
            <TouchableOpacity
              onPress={handleAdd}
              disabled={!name.trim() || loading}
            >
              <Text
                style={[
                  styles.addText,
                  (!name.trim() || loading) && styles.addTextDisabled,
                ]}
              >
                Add
              </Text>
            </TouchableOpacity>
          </View>

          {/* Name input */}
          <Text style={styles.label}>Habit name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Morning Run, Read 30 mins..."
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
            autoFocus
            maxLength={40}
          />

          {/* Color picker */}
          <Text style={styles.label}>Pick a color</Text>
          <View style={styles.colorGrid}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorDot,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorDotSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          {/* Preview */}
          <Text style={styles.label}>Preview</Text>
          <View style={styles.previewCard}>
            <View
              style={[styles.previewDot, { backgroundColor: selectedColor }]}
            />
            <Text style={styles.previewText}>
              {name.trim() || "Your habit name"}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  inner: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
    paddingTop: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#ffffff",
  },
  cancelText: {
    fontSize: 17,
    color: "#888",
  },
  addText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#6366f1",
  },
  addTextDisabled: {
    opacity: 0.3,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 24,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#ffffff",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: "#ffffff",
    transform: [{ scale: 1.15 }],
  },
  previewCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  previewDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  previewText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
});
