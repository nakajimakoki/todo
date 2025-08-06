/**
 * ToDo入力用バリデーション
 * @param text 入力された文字列
 * @returns エラーがあればメッセージ、なければ null
 */
export const validateTodoInput = (text: string): string | null => {
  if (!text.trim()) {
    return "内容を入力してください";
  }
  if (text.includes("<") || text.includes(">")) {
    return "不正な文字が含まれています";
  }
  if (text.length > 15) {
    return "15文字以内で入力してください";
  }
  return null;
};
