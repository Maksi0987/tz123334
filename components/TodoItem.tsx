import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import type { Todo } from "@/types";

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);

  const handleSave = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setText(todo.text);
      setIsEditing(false);
      return;
    }
    if (trimmed !== todo.text) {
      await onEdit(todo.id, trimmed);
    }
    setIsEditing(false);
  };

  return (
    <View style={[styles.card, todo.completed && styles.cardCompleted]}>
      <TouchableOpacity style={[styles.checkbox, todo.completed && styles.checkboxActive]} onPress={() => onToggle(todo.id, !todo.completed)}>
        {todo.completed && <Text style={styles.check}>✓</Text>}
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={styles.editInput}
          value={text}
          onChangeText={setText}
          onBlur={handleSave}
          onSubmitEditing={handleSave}
          autoFocus
        />
      ) : (
        <Text style={[styles.text, todo.completed && styles.textCompleted]} onPress={() => !todo.completed && setIsEditing(true)}>
          {todo.text}
        </Text>
      )}

      <View style={styles.actions}>
        {!isEditing && (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.icon}>✏️</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => onDelete(todo.id)}>
          <Text style={styles.icon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 12, marginBottom: 8, gap: 10 },
  cardCompleted: { backgroundColor: "#f1f5f9" },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: "#cbd5e1", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  checkboxActive: { backgroundColor: "#10b981", borderColor: "#10b981" },
  check: { color: "#fff", fontWeight: "bold" },
  text: { flex: 1, fontSize: 15, color: "#1e293b" },
  textCompleted: { textDecorationLine: "line-through", color: "#94a3b8" },
  editInput: { flex: 1, fontSize: 15, borderWidth: 1, borderColor: "#6366f1", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "#fff" },
  actions: { flexDirection: "row", gap: 6 },
  icon: { fontSize: 16 },
});
