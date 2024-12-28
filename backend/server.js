const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));

const tasks = [];

app.get("/api", (req, res) => {
  res.json(tasks);
});

app.post("/api/addTask", (req, res) => {
  const newTask = req.body;
  tasks.push(newTask);

  res.json(newTask);
});

app.put("/api/updateTask/:id", (req, res) => {
  const id = Number(req.params.id);
  const isCompleted = req.body;

  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.iscompleted = isCompleted;
  } else {
    res.status(404);
  }
});

app.delete("/api/deleteTask/:id", (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.json({ message: "Task Deleted successfully" });
  } else {
    res.status(404);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(5000, () => console.log("Backend server is running on port 5000"));
