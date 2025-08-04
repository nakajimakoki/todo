// components/ViewSwitch.js
import React from "react";

export default function ViewSwitch({ viewMode, setViewMode }) {
  return (
    <div className="view-switch-bar">
      <button
        className={`view-switch-btn${viewMode === "list" ? " active" : ""}`}
        onClick={() => setViewMode("list")}
      >
        一覧表示
      </button>
      <button
        className={`view-switch-btn${viewMode === "board" ? " active" : ""}`}
        onClick={() => setViewMode("board")}
      >
        ボード表示
      </button>
    </div>
  );
}
