import { useState, useEffect } from "react";
import { Todo } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons";
import TaskFormModal from "./TaskFormModal";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskToEdit, setEditingTodo] = useState<Todo | null>(null);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");

  const [initialized, setInitialized] = useState(false);
  const localStorageKey = "TodoApp";

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
      setTodos(initTodos);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const uncompletedCount = todos.filter((todo: Todo) => !todo.isDone).length;

  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    } else {
      return "";
    }
  };

  const sortByPriority = () => {
    const sortedTodos = [...todos].sort((a, b) => b.priority - a.priority);
    setTodos(sortedTodos);
  };

  const sortByDeadline = () => {
    const sortedTodos = [...todos].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
    setTodos(sortedTodos);
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value));
    setNewTodoName(e.target.value);
  };

  const updateNewTodoPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value));
  };

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value;
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: value };
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
  };

  const addOrUpdateTodo = () => {
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }

    if (taskToEdit) {
      // 編集モード: 既存のタスクを更新
      const updatedTodos = todos.map((todo) =>
        todo.id === taskToEdit.id
          ? {
              ...todo,
              name: newTodoName,
              priority: newTodoPriority,
              deadline: newTodoDeadline,
            }
          : todo
      );
      setTodos(updatedTodos);
    } else {
      // 新規作成モード: 新しいタスクを追加
      const newTodo: Todo = {
        id: uuid(),
        name: newTodoName,
        isDone: false,
        priority: newTodoPriority,
        deadline: newTodoDeadline,
      };
      setTodos([...todos, newTodo]);
    }

    resetForm();
  };

  const resetForm = () => {
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
    setShowTaskForm(false);
    setEditingTodo(null);
  };

  const removeCompletedTodos = () => {
    const updatedTodos = todos.filter((todo) => !todo.isDone);
    setTodos(updatedTodos);
  };

  const remove = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodoName(todo.name);
    setNewTodoPriority(todo.priority);
    setNewTodoDeadline(todo.deadline);
    setShowTaskForm(true);
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
      <TodoList
        todos={todos}
        updateIsDone={updateIsDone}
        remove={remove}
        startEditing={startEditing}
      />

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
          onClose={resetForm}
          newTodoName={newTodoName}
          newTodoNameError={newTodoNameError}
          newTodoPriority={newTodoPriority}
          newTodoDeadline={newTodoDeadline}
          updateNewTodoName={updateNewTodoName}
          updateNewTodoPriority={updateNewTodoPriority}
          updateDeadline={updateDeadline}
          addOrUpdateTodo={addOrUpdateTodo}
          isEditing={!!taskToEdit}
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
