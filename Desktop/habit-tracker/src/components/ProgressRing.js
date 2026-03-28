import { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "../theme";

const SIZE = 80;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressRing({ completed, total }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: total === 0 ? 0 : completed / total,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [completed, total]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.card}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={percentage === 100 ? colors.light : colors.primary}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={
            CIRCUMFERENCE * (1 - (total === 0 ? 0 : completed / total))
          }
          strokeLinecap="round"
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
      <View style={styles.centerText}>
        <Text
          style={[
            styles.percentage,
            percentage === 100 && { color: colors.light },
          ]}
        >
          {percentage}%
        </Text>
        <Text style={styles.label}>done</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    position: "absolute",
    alignItems: "center",
  },
  percentage: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  label: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: -2,
  },
});
