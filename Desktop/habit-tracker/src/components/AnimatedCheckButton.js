import { useRef, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import * as Haptics from "expo-haptics";
import { colors } from "../theme";

export default function AnimatedCheckButton({ done, color, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (done) {
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.3,
          damping: 4,
          stiffness: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 8,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [done]);

  const handlePress = async () => {
    if (!done) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.button,
          {
            borderColor: color,
            backgroundColor: done ? color : "transparent",
          },
          { transform: [{ scale }] },
        ]}
      >
        <Text style={[styles.icon, { color: done ? "#fff" : color }]}>
          {done ? "✓" : "+"}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 22,
  },
});
