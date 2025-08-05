// components/ViewSwitch.tsx
import React from "react";

type ViewMode = "list" | "board";

type ViewSwitchProps = {
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
};

export default function ViewSwitch({ viewMode, setViewMode }: ViewSwitchProps) {
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
