import React from "react";
import { Todo } from "./types";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faClock,
  faFaceGrinWide,
} from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
  startEditing: (todo: Todo) => void;
};

const num2star = (n: number): string => "★".repeat(n);

const TodoList = ({ todos, updateIsDone, remove, startEditing }: Props) => {
  const isOverdue = (deadline: Date | null): boolean => {
    if (!deadline) return false;
    return dayjs(deadline).isBefore(dayjs());
  };

  if (todos.length === 0) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-md">
        <div className="text-red-600">
          すべてのタスクを達成しました🎉お疲れ様です！
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <div
          key={todo.id}
          onClick={() => startEditing(todo)}
          className={twMerge(
            "cursor-pointer rounded-md border border-slate-500 bg-white px-3 py-2 drop-shadow-md transition hover:bg-gray-100",
            todo.isDone && "bg-blue-50 opacity-50",
            isOverdue(todo.deadline) && !todo.isDone && "bg-red-50"
          )}
        >
          {todo.isDone && (
            <div className="mb-1 rounded bg-blue-400 px-2 py-0.5 text-center text-xs text-white">
              <FontAwesomeIcon icon={faFaceGrinWide} className="mr-1.5" />
              完了済み
              <FontAwesomeIcon icon={faFaceGrinWide} className="ml-1.5" />
            </div>
          )}
          {isOverdue(todo.deadline) && !todo.isDone && (
            <div className="mb-1 rounded bg-red-400 px-2 py-0.5 text-center text-xs text-white">
              期限切れ
            </div>
          )}
          <div className="flex items-baseline text-slate-700">
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={(e) => updateIsDone(todo.id, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="mr-1.5 cursor-pointer"
            />
            <FontAwesomeIcon icon={faFile} flip="horizontal" className="mr-1" />
            <div
              className={twMerge(
                "text-lg font-bold",
                todo.isDone && "line-through decoration-2"
              )}
            >
              {todo.name}
            </div>
            <div className="ml-2">優先度 </div>
            <div className="ml-2 text-orange-400">
              {num2star(todo.priority)}
            </div>
          </div>
          {todo.deadline && (
            <div className="ml-4 flex items-center text-sm text-slate-500">
              <FontAwesomeIcon
                icon={faClock}
                flip="horizontal"
                className="mr-1.5"
              />
              <div className={twMerge(todo.isDone && "line-through")}>
                期限: {dayjs(todo.deadline).format("YYYY年M月D日 H時m分")}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TodoList;
