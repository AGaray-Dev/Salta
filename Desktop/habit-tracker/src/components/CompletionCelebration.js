import { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import * as Haptics from "expo-haptics";
import { colors } from "../theme";

export default function CompletionCelebration({ visible, onDone }) {
  const confettiRef = useRef(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (visible) {
      // Trigger heavy haptic for celebration
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Animate the message in
      Animated.parallel([
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 6,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Fire confetti
      setTimeout(() => confettiRef.current?.start(), 100);

      // Auto dismiss after 3 seconds
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => onDone?.());
      }, 3000);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <ConfettiCannon
        ref={confettiRef}
        count={120}
        origin={{ x: 200, y: 0 }}
        colors={[
          colors.primary,
          colors.medium,
          colors.light,
          colors.soft,
          "#ffffff",
        ]}
        fadeOut
        autoStart={false}
      />
      <Animated.View
        style={[styles.message, { opacity, transform: [{ scale }] }]}
      >
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>All done!</Text>
        <Text style={styles.subtitle}>You crushed it today</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  message: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
