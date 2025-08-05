import { Todo } from "./todo";

export type Editing =
  | { mode: "none" }
  | { mode: "editing"; id: number; text: string; status: Todo["status"] };
