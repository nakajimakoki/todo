import React from "react";
import { ViewMode } from "../types/viewMode";

type ViewSwitchProps = {
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
};

export default function ViewSwitch({ viewMode, setViewMode }: ViewSwitchProps) {
  return (
    <div className="view-switch-bar">
      <button
        className={`view-switch-btn${
          viewMode.type === "list" ? " active" : ""
        }`}
        onClick={() => setViewMode({ type: "list" })}
      >
        一覧表示
      </button>
      <button
        className={`view-switch-btn${
          viewMode.type === "board" ? " active" : ""
        }`}
        onClick={() => setViewMode({ type: "board" })}
      >
        ボード表示
      </button>
    </div>
  );
}
