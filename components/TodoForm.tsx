import { useState } from "react";
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export function TodoForm({ onAdd, loading }: { onAdd: (t: string) => Promise<void>; loading: boolean }) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting || loading) return;
    try {
      setIsSubmitting(true);
      Keyboard.dismiss();
      await onAdd(trimmed);
      setText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Що потрібно зробити?"
        placeholderTextColor="#94a3b8"
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      <TouchableOpacity
        style={[styles.button, (!text.trim() || loading || isSubmitting) && styles.disabled]}
        onPress={handleSubmit}
        disabled={!text.trim() || loading || isSubmitting}
      >
        <Text style={styles.btnText}>{isSubmitting ? "..." : "Додати"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 10, marginBottom: 16 },
  input: { flex: 1, height: 48, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 14, fontSize: 15 },
  button: { backgroundColor: "#6366f1", paddingHorizontal: 18, justifyContent: "center", alignItems: "center", borderRadius: 10 },
  disabled: { opacity: 0.5 },
  btnText: { color: "#fff", fontWeight: "600" },
});
