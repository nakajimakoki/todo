import { toast } from "react-toastify";

// カラースタイル定義
const toastStyles = {
  success: {
    background: "#d1e7dd",
    color: "#0f5132",
  },
  error: {
    background: "#f8d7da",
    color: "#842029",
  },
};

// 関数定義（個別でもまとめてもOK）
export const toastSuccess = (message) =>
  toast.success(message, { style: toastStyles.success });

export const toastError = (message) =>
  toast.error(message, { style: toastStyles.error });
