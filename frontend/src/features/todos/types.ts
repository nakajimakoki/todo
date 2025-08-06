// src/features/todos/types.ts
export type Editing =
  | { mode: "none" }
  | { mode: "editing"; id: number; text: string; status: Todo["status"] };

export type Todo = {
  id: number;
  title: string;
  status: "未着手" | "進行中" | "完了";
  tag?: string;
  taskId?: string;
  createdAt: string;
  updatedAt: string;
};
