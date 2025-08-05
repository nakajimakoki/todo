export type Todo = {
  id: number;
  title: string;
  status: "未着手" | "進行中" | "完了";
  tag?: string;
  taskId?: string;
  createdAt: string;
  updatedAt: string;
};
