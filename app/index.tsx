import { useState, useEffect, useMemo } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import type { Todo } from "@/types";
import { getTodos, addTodo, toggleTodo, updateTodoText, deleteTodo } from "@/services/api";

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError(null);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError("Не вдалося з'єднатися з json-server (порт 3000).");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const handleAdd = async (text: string) => {
    try {
      const item = await addTodo(text);
      setTodos((prev) => [...prev, item]);
    } catch (err) {
      Alert.alert("Помилка", "Не вдалося додати завдання.");
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
      await toggleTodo(id, completed);
    } catch (err) {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
    }
  };

  const handleEdit = async (id: string, text: string) => {
    try {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
      await updateTodoText(id, text);
    } catch (err) {
      fetchTodos();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      await deleteTodo(id);
    } catch (err) {
      fetchTodos();
    }
  };

  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.card}>
          <Header totalCount={todos.length} completedCount={completedCount} />
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
              <TouchableOpacity onPress={() => fetchTodos()} style={styles.retryBtn}>
                <Text style={styles.retryText}>Повторити</Text>
              </TouchableOpacity>
            </View>
          )}
          <TodoForm onAdd={handleAdd} loading={loading} />
          {loading && !refreshing && todos.length === 0 ? (
            <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 30 }} />
          ) : (
            <TodoList
              todos={todos}
              refreshing={refreshing}
              onRefresh={() => fetchTodos(true)}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#e2e8f0" },
  container: { flex: 1, padding: 16 },
  card: { flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 16 },
  errorBanner: { backgroundColor: "#fee2e2", padding: 10, borderRadius: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  errorText: { color: "#991b1b", fontSize: 13, flex: 1 },
  retryBtn: { backgroundColor: "#ef4444", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  retryText: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
