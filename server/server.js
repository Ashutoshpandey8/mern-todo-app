// const express = require("express");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// let todos = [{ id: 1, text: "Learn React + Express", done: false }];
// let nextId = 2;

// // READ all todos
// app.get("/api/todos", (req, res) => {
//   res.json(todos);
// });

// // CREATE a todo
// app.post("/api/todos", (req, res) => {
//   const todo = { id: nextId++, text: req.body.text, done: false };
//   todos.push(todo);
//   res.status(201).json(todo);
// });

// // UPDATE (toggle done)
// app.put("/api/todos/:id", (req, res) => {
//   const todo = todos.find((t) => t.id === Number(req.params.id));
//   if (!todo) return res.status(404).json({ error: "Not found" });
//   todo.done = !todo.done;
//   res.json(todo);
// });

// // DELETE
// app.delete("/api/todos/:id", (req, res) => {
//   todos = todos.filter((t) => t.id !== Number(req.params.id));
//   res.json({ success: true });
// });

// app.listen(5000, (req,res) =>
//     res.json({sucess:true}),
//     console.log("Server running on port 5000"),
// );



require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

// 2. Schema + Model (the shape of a todo)
const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Todo = mongoose.model("Todo", todoSchema);

// 3. Routes
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const todo = await Todo.create({ text: req.body.text });
  res.status(201).json(todo);
});

app.put("/api/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ error: "Not found" });
  todo.done = !todo.done;
  await todo.save();
  res.json(todo);
});

app.delete("/api/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on port 5000"));