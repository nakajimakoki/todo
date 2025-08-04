// api/todoService.js
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

export async function fetchTodos() {
  const res = await fetch(`${API_BASE}/todos`);
  if (!res.ok) throw new Error("ToDoの取得に失敗しました");
  return await res.json();
}

export async function createTodo(newTodo) {
  const res = await fetch(`${API_BASE}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTodo, status: "未着手" }),
  });
  if (!res.ok) throw new Error("ToDoの追加に失敗しました");
  return await res.json();
}

export async function updateTodo(id, data) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("ToDoの更新に失敗しました");
  return await res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("ToDoの削除に失敗しました");
  return true;
}
