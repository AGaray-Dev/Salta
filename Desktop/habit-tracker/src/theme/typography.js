import { StyleSheet } from "react-native";

export const typography = StyleSheet.create({
  display: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  caption: {
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 16,
  },
});
