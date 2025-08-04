import React, { useMemo } from "react";
import "./JiraBoard.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// ステータス定義
const STATUS_LIST = [
  { key: "未着手", label: "未着手", color: "#d32f2f" },
  { key: "進行中", label: "進行中", color: "#ffb300" },
  { key: "完了", label: "完了", color: "#555" },
];

// ToDoカード
function JiraCard({ todo, status, provided }) {
  return (
    <div
      className={`jira-board-card jira-board-card-${status.key}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      {/* カラーライン */}
      <div
        className="jira-board-card-line"
        style={{ background: status.color }}
      />
      <div className="jira-board-card-content">
        {todo.tag && (
          <span
            className="jira-board-card-badge"
            style={{ background: "#e0e7ff", color: "#3730a3" }}
          >
            {todo.tag}
          </span>
        )}
        <div className="jira-board-card-title">{todo.title}</div>
        <div className="jira-board-card-id">
          {todo.taskId || `TIS-${todo.id}`}
        </div>
      </div>
    </div>
  );
}

// カラム
function JiraColumn({ status, todos }) {
  return (
    <Droppable droppableId={status.key}>
      {(provided) => (
        <div
          className={`jira-board-column jira-board-column-${status.key}`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className="jira-board-column-header">
            <span
              className="jira-board-column-title"
              style={{ color: status.color }}
            >
              {status.label}
            </span>
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
                  <JiraCard todo={todo} status={status} provided={provided} />
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

function JiraBoard({ todos, onStatusChange }) {
  // ステータスごとに分類（useMemoで不要な再計算防止）
  const columns = useMemo(() => {
    return STATUS_LIST.reduce((acc, s) => {
      acc[s.key] = todos.filter((t) => t.status === s.key);
      return acc;
    }, {});
  }, [todos]);

  // ドラッグ終了時の処理
  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const todoId = Number(draggableId);
    const newStatus = destination.droppableId;
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

export default JiraBoard;
