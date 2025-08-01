import React from "react";
import "./JiraBoard.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const statusList = [
  { key: "未着手", label: "TO DO", color: "#2563eb" }, // 青
  { key: "進行中", label: "IN PROGRESS", color: "#ef4444" }, // 赤
  { key: "完了", label: "DONE", color: "#22c55e" }, // 緑
];

function JiraBoard({ todos, onStatusChange }) {
  // カラムごとにToDoを分割
  const columns = statusList.reduce((acc, s) => {
    acc[s.key] = todos.filter((t) => t.status === s.key);
    return acc;
  }, {});

  // ドラッグ終了時の処理
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
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
          {statusList.map((status) => (
            <Droppable droppableId={status.key} key={status.key}>
              {(provided, snapshot) => (
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
                    <span className="jira-board-column-count">
                      {columns[status.key].length}
                    </span>
                  </div>
                  <div className="jira-board-cards">
                    {columns[status.key].map((todo, idx) => (
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id.toString()}
                        index={idx}
                      >
                        {(provided, snapshot) => (
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
                              {/* タグバッジ（例として仮データ） */}
                              {todo.tag && (
                                <span
                                  className="jira-board-card-badge"
                                  style={{
                                    background: "#e0e7ff",
                                    color: "#3730a3",
                                  }}
                                >
                                  {todo.tag}
                                </span>
                              )}
                              <div className="jira-board-card-title">
                                {todo.title}
                              </div>
                              <div className="jira-board-card-id">
                                {todo.taskId || `TIS-${todo.id}`}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default JiraBoard;
