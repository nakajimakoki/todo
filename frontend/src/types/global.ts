import { Todo } from "../features/todos/types";

export type FilterStatus =
  | { kind: "all" }
  | { kind: "status"; value: Todo["status"] };

export type ViewMode = { type: "list" } | { type: "board" };
