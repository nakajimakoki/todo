// JiraCard.tsx
import React from "react";
import { DraggableProvided } from "@hello-pangea/dnd";
import { Todo } from "../../todos/types";

type JiraCardProps = {
  todo: Todo;
  status: Todo["status"];
  provided: DraggableProvided;
};

export default function JiraCard({ todo, status, provided }: JiraCardProps) {
  return (
    <div
      className={`jira-board-card jira-board-card-${status}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div className="jira-board-card-content">
        {todo.tag && <span className="jira-board-card-badge">{todo.tag}</span>}
        <div className="jira-board-card-title">{todo.title}</div>
      </div>
    </div>
  );
}
