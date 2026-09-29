import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import type { Todo } from "@/types";
import { TodoItem } from "./TodoItem";

export function TodoList({
  todos,
  refreshing,
  onRefresh,
  onToggle,
  onDelete,
  onEdit,
}: {
  todos: Todo[];
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, text: string) => Promise<void>;
}) {
  if (todos.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Список завдань порожній. Додайте нове завдання!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TodoItem todo={item} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6366f1"]} />}
    />
  );
}

const styles = StyleSheet.create({
  empty: { paddingVertical: 36, alignItems: "center" },
  emptyText: { color: "#94a3b8" },
});
