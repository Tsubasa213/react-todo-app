import React, { useEffect } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faXmark,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  newTodoName: string;
  newTodoNameError: string;
  newTodoPriority: number;
  newTodoDeadline: Date | null;
  updateNewTodoName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateNewTodoPriority: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateDeadline: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addOrUpdateTodo: () => void;
  isEditing: boolean;
  onDelete?: () => void; // 削除機能のために追加
};

const TaskFormModal = ({
  isOpen,
  onClose,
  newTodoName,
  newTodoNameError,
  newTodoPriority,
  newTodoDeadline,
  updateNewTodoName,
  updateNewTodoPriority,
  updateDeadline,
  addOrUpdateTodo,
  isEditing,
  onDelete,
}: Props) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !newTodoNameError && newTodoName.length >= 2) {
        addOrUpdateTodo();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isOpen, addOrUpdateTodo, onClose, newTodoNameError, newTodoName]);

  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="モーダルを閉じる"
        >
          <FontAwesomeIcon icon={faXmark} className="size-5" />
        </button>

        <h2 id="modal-title" className="mb-4 text-lg font-bold">
          {isEditing ? "タスクの編集" : "新しいタスクの追加"}
        </h2>

        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <label className="font-bold" htmlFor="newTodoName">
                名前
              </label>
              <input
                id="newTodoName"
                type="text"
                value={newTodoName}
                onChange={updateNewTodoName}
                className={twMerge(
                  "grow rounded-md border p-2",
                  newTodoNameError && "border-red-500 outline-red-500"
                )}
                placeholder="2文字以上、32文字以内で入力してください"
                autoFocus
                aria-invalid={!!newTodoNameError}
              />
            </div>
            {newTodoNameError && (
              <div
                className="ml-10 flex items-center space-x-1 text-sm font-bold text-red-500"
                role="alert"
              >
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="mr-0.5"
                />
                <div>{newTodoNameError}</div>
              </div>
            )}
          </div>

          <div className="flex gap-5">
            <div className="font-bold">優先度</div>
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="flex items-center space-x-1">
                <input
                  id={`priority-${value}`}
                  name="priorityGroup"
                  type="radio"
                  value={value}
                  checked={newTodoPriority === value}
                  onChange={updateNewTodoPriority}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-x-2">
            <label htmlFor="deadline" className="font-bold">
              期限
            </label>
            <input
              type="datetime-local"
              id="deadline"
              value={
                newTodoDeadline
                  ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                  : ""
              }
              onChange={updateDeadline}
              className="rounded-md border border-gray-400 px-2 py-0.5"
            />
          </div>

          <div className="flex justify-between space-x-3 pt-4">
            <div>
              {isEditing && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center rounded-md bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  削除
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={addOrUpdateTodo}
                className={twMerge(
                  "rounded-md bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-600",
                  newTodoNameError && "cursor-not-allowed opacity-50"
                )}
                disabled={!!newTodoNameError}
                aria-disabled={!!newTodoNameError}
              >
                {isEditing ? "更新" : "追加"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;
