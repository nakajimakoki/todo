import React, { useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Todo } from "../../todos/types";
import JiraCard from "./JiraCard";
import "../styles/JiraBoard.css";

type Status = {
  key: Todo["status"];
  label: string;
  color: string;
};

const STATUS_LIST: Status[] = [
  { key: "未着手", label: "未着手", color: "#555" },
  { key: "進行中", label: "進行中", color: "#555" },
  { key: "完了", label: "完了", color: "#555" },
];

// カラム
type JiraColumnProps = {
  status: Status;
  todos: Todo[];
};

function JiraColumn({ status, todos }: JiraColumnProps) {
  return (
    <Droppable droppableId={status.key}>
      {(provided) => (
        <div
          className={`jira-board-column jira-board-column-${status.key}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className="jira-board-column-header">
            <span className="jira-board-column-title">{status.label}</span>
            <span className="jira-board-column-count">{todos.length}</span>
          </div>
          <div className="jira-board-cards">
            {todos.map((todo, idx) => (
              <Draggable
                key={todo.id}
                draggableId={todo.id.toString()}
                index={idx}
              >
                {(provided) => (
                  <JiraCard
                    todo={todo}
                    status={status.key}
                    provided={provided}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

type JiraBoardProps = {
  todos: Todo[];
  onStatusChange: (
    todoId: number,
    newStatus: Todo["status"]
  ) => void | Promise<void>;
};

export default function JiraBoard({ todos, onStatusChange }: JiraBoardProps) {
  // ステータスごとに分類
  const columns = useMemo(() => {
    const result: Record<Todo["status"], Todo[]> = {
      未着手: [],
      進行中: [],
      完了: [],
    };
    todos.forEach((todo) => {
      result[todo.status].push(todo);
    });
    return result;
  }, [todos]);

  // ドラッグ終了時の処理
  const onDragEnd = ({ source, destination, draggableId }: DropResult) => {
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const todoId = Number(draggableId);
    const newStatus = destination.droppableId as Todo["status"];
    onStatusChange(todoId, newStatus);
  };

  return (
    <div className="jira-board-root">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="jira-board-columns">
          {STATUS_LIST.map((status) => (
            <JiraColumn
              key={status.key}
              status={status}
              todos={columns[status.key]}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
