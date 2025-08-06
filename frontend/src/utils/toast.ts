import { toast } from "react-toastify";
import { CSSProperties, ReactNode } from "react";

// カラースタイル定義
const toastStyles: Record<"success" | "error", CSSProperties> = {
  success: {
    background: "#d1e7dd",
    color: "#0f5132",
  },
  error: {
    background: "#f8d7da",
    color: "#842029",
  },
};

// 関数定義
export const toastSuccess = (message: string | ReactNode) =>
  toast.success(message, { style: toastStyles.success });

export const toastError = (message: string | ReactNode) =>
  toast.error(message, { style: toastStyles.error });
