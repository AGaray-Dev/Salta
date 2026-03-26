import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) Alert.alert("Sign up failed", error.message);
      else Alert.alert("Check your email!", "We sent you a confirmation link.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) Alert.alert("Login failed", error.message);
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        {/* Logo area */}
        <View style={styles.logoArea}>
          <Text style={styles.logo}>🔥</Text>
          <Text style={styles.appName}>HabitFlow</Text>
          <Text style={styles.tagline}>Build habits that stick</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Loading..." : isSignUp ? "Create account" : "Sign in"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Toggle signup/login */}
        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.toggleText}>
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    justifyContent: "center",
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 12,
  },
  appName: {
    fontSize: 36,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: "#666666",
    marginTop: 6,
  },
  form: {
    gap: 12,
    marginBottom: 24,
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
  button: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  toggleText: {
    color: "#6366f1",
    textAlign: "center",
    fontSize: 14,
  },
});
