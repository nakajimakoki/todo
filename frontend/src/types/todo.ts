export type Todo = {
  id: number;
  title: string;
  status: "未着手" | "進行中" | "完了";
  createdAt: string; // ISO文字列 or Date
  updatedAt: string;
};
