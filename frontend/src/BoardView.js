import React from "react";
import "./BoardView.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const statusList = [
  { key: "未着手", label: "未着手" },
  { key: "進行中", label: "進行中" },
  { key: "完了", label: "完了" },
];

function BoardView({ todos, onStatusChange }) {
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
    <div className="board-view-root">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-columns">
          {statusList.map((status) => (
            <Droppable droppableId={status.key} key={status.key}>
              {(provided, snapshot) => (
                <div
                  className={`board-column board-column-${status.key}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="board-column-title">{status.label}</div>
                  {columns[status.key].map((todo, idx) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id.toString()}
                      index={idx}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`board-card board-card-${status.key}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="board-card-title">{todo.title}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default BoardView;
