import { useEffect, useState } from "react";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../api/todoService";
import { toastSuccess, toastError } from "../../../utils/toast";
import { validateTodoInput } from "../../../utils/validation";
import { Todo, Editing } from "../types";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [editing, setEditing] = useState<Editing>({ mode: "none" });

  // 初期データ取得
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTodos();
        setTodos(data);
      } catch {
        toastError("ToDoの取得に失敗しました");
      }
    })();
  }, []);

  // 新規追加
  const addTodo = async () => {
    const error = validateTodoInput(newTodo);
    if (error) {
      toastError(error);
      return;
    }
    try {
      const created = await createTodo(newTodo);
      setTodos((prev) => [...prev, created]);
      setNewTodo("");
      toastSuccess("ToDoを追加しました");
    } catch {
      toastError("ToDoの追加に失敗しました");
    }
  };

  // 更新
  const updateExistingTodo = async (todo: Todo) => {
    if (editing.mode !== "editing") return;
    const error = validateTodoInput(editing.text);
    if (error) {
      toastError(error);
      return;
    }
    if (editing.text === todo.title && editing.status === todo.status) return;

    try {
      const updated = await updateTodo(todo.id, {
        ...todo,
        title: editing.text,
        status: editing.status,
      });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
      setEditing({ mode: "none" });
      toastSuccess("ToDoを更新しました");
    } catch {
      toastError("ToDoの更新に失敗しました");
    }
  };

  // 削除
  const removeTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos((prev) => prev.filter((t) => t.id !== todoId));
      toastSuccess("ToDoを削除しました");
    } catch {
      toastError("ToDoの削除に失敗しました");
    }
  };

  // ステータス変更
  const changeStatus = async (todoId: number, newStatus: Todo["status"]) => {
    const todo = todos.find((t) => t.id === todoId);
    if (!todo || todo.status === newStatus) return;

    try {
      const updated = await updateTodo(todoId, {
        ...todo,
        status: newStatus,
      });
      setTodos((prev) => prev.map((t) => (t.id === todoId ? updated : t)));
      toastSuccess("ステータスを更新しました");
    } catch {
      toastError("ステータスの更新に失敗しました");
    }
  };

  return {
    todos,
    newTodo,
    setNewTodo,
    editing,
    setEditing,
    addTodo,
    updateExistingTodo,
    removeTodo,
    changeStatus,
  };
}
