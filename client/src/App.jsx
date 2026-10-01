import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  // Load todos when the page opens
  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then(setTodos);
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setText("");
  };

  const toggleTodo = async (id) => {
    const res = await fetch(`/api/todos/${id}`, { method: "PUT" });
    const updated = await res.json();
    setTodos(todos.map((t) => (t._id === id ? updated : t)));
  };

  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter((t) => t._id !== id));
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Todo App</h1>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New todo"
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <span
              onClick={() => toggleTodo(t.id)}
              style={{
                textDecoration: t.done ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {t.text}
            </span>
            <button onClick={() => deleteTodo(t._id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;