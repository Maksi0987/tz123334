import { StyleSheet, Text, View } from "react-native";

export function Header({ totalCount, completedCount }: { totalCount: number; completedCount: number }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>📝 Мій Список Завдань</Text>
      <Text style={styles.subtitle}>
        {totalCount > 0 ? `Виконано ${completedCount} з ${totalCount} завдань` : "Додайте перше завдання"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 16, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", color: "#1e293b", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#64748b" },
});
