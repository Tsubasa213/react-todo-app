import { useState, useEffect } from "react";
import { Todo } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge"; // ◀◀ 追加
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // ◀◀ 追加
import {
  faTriangleExclamation,
  faArrowDownWideShort,
} from "@fortawesome/free-solid-svg-icons"; // faArrowDownWideShort を追加
import TaskFormModal from "./TaskFormModal"; // 追加

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]); // ◀◀ 編集
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");

  const [initialized, setInitialized] = useState(false); // ◀◀ 追加
  const localStorageKey = "TodoApp"; // ◀◀ 追加

  // App コンポーネントの初回実行時のみLocalStorageからTodoデータを復元
  useEffect(() => {
    const todoJsonStr = localStorage.getItem(localStorageKey);
    if (todoJsonStr && todoJsonStr !== "[]") {
      const storedTodos: Todo[] = JSON.parse(todoJsonStr);
      const convertedTodos = storedTodos.map((todo) => ({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      }));
      setTodos(convertedTodos);
    } else {
      // LocalStorage にデータがない場合は initTodos をセットする
      setTodos(initTodos);
    }
    setInitialized(true);
  }, []);

  // 状態 todos または initialized に変更があったときTodoデータを保存
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const uncompletedCount = todos.filter((todo: Todo) => !todo.isDone).length;

  // ▼▼ 追加
  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    } else {
      return "";
    }
  };

  const sortByPriority = () => {
    const sortedTodos = [...todos].sort((a, b) => b.priority - a.priority);
    console.log("優先度でソートされたタスクリスト:", sortedTodos);
    setTodos(sortedTodos);
  };

  // todosを期限でソート (期限が近い順に表示)
  const sortByDeadline = () => {
    const sortedTodos = [...todos].sort((a, b) => {
      if (!a.deadline) return 1; // aに期限がない場合、後ろに移動
      if (!b.deadline) return -1; // bに期限がない場合、前に移動
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
    setTodos(sortedTodos);
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value)); // ◀◀ 追加
    setNewTodoName(e.target.value);
  };

  const updateNewTodoPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value)); // 文字列を数値に変換
  };

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value; // UIで日時が未設定のときは空文字列 "" が dt に格納される
    console.log(`UI操作で日時が "${dt}" (${typeof dt}型) に変更されました。`);
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: value }; // スプレッド構文
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
  };

  // addNewTodo 関数を修正
  const addNewTodo = () => {
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }
    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline,
    };
    setTodos([...todos, newTodo]);
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
    setShowTaskForm(false); // モーダルを閉じる
  };

  const removeCompletedTodos = () => {
    const updatedTodos = todos.filter((todo) => !todo.isDone);
    setTodos(updatedTodos);
  };

  const remove = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  return (
    <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
      <h1 className="mb-4 text-2xl font-bold">TodoApp</h1>
      <div className="mb-4">
        <WelcomeMessage
          name="寝屋川タヌキ"
          uncompletedCount={uncompletedCount}
        />
        <div className="mt-5 flex justify-start space-x-4">
          <button
            type="button"
            onClick={sortByPriority}
            className="rounded-md bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faArrowDownWideShort} className="ml-1" />
            優先度でソート
          </button>
          <button
            type="button"
            onClick={sortByDeadline}
            className="rounded-md bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faArrowDownWideShort} className="ml-1" />
            期限でソート
          </button>
        </div>
      </div>
      <TodoList todos={todos} updateIsDone={updateIsDone} remove={remove} />

      <div className="mt-5">
        <button
          type="button"
          onClick={() => setShowTaskForm(true)}
          className="w-full rounded-md bg-indigo-500 px-3 py-2 font-bold text-white hover:bg-indigo-600"
        >
          ＋ 新しいタスクを追加
        </button>

        <TaskFormModal
          isOpen={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          newTodoName={newTodoName}
          newTodoNameError={newTodoNameError}
          newTodoPriority={newTodoPriority}
          newTodoDeadline={newTodoDeadline}
          updateNewTodoName={updateNewTodoName}
          updateNewTodoPriority={updateNewTodoPriority}
          updateDeadline={updateDeadline}
          addNewTodo={addNewTodo}
        />

        <button
          type="button"
          onClick={removeCompletedTodos}
          className="mt-4 w-full rounded-md bg-red-500 px-3 py-2 font-bold text-white hover:bg-red-600"
        >
          完了済みのタスクを削除
        </button>
      </div>
    </div>
  );
};

export default App;
