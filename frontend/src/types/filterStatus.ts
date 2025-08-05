import { Todo } from "./todo";

export type FilterStatus =
  | { kind: "all" }
  | { kind: "status"; value: Todo["status"] };
