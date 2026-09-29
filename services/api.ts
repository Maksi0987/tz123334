import Constants from "expo-constants";
import { Platform } from "react-native";
import type { Todo } from "@/types";

const getBaseUrl = (): string => {
  if (Platform.OS === "web") return "http://localhost:3000";
  const hostUri = Constants.expoConfig?.hostUri ?? (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(":")[0];
    return `http://${ip}:3000`;
  }
  return Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";
};

const BASE_URL = getBaseUrl();
const API_URL = `${BASE_URL}/todos`;

export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Помилка: ${res.statusText}`);
  return res.json();
};

export const addTodo = async (text: string): Promise<Todo> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, completed: false, createdAt: Date.now() }),
  });
  if (!res.ok) throw new Error(`Помилка: ${res.statusText}`);
  return res.json();
};

export const toggleTodo = async (id: string, completed: boolean): Promise<Todo> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error(`Помилка: ${res.statusText}`);
  return res.json();
};

export const updateTodoText = async (id: string, text: string): Promise<Todo> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Помилка: ${res.statusText}`);
  return res.json();
};

export const deleteTodo = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Помилка: ${res.statusText}`);
};
