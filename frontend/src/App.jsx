import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const handleAddTask = () => {
    if (newTask) {
      const newTaskObject = {
        id: Date.now(),
        name: newTask,
        iscompleted: false,
      };

      fetch("/api/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTaskObject),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to post... line 30");
          }
          return res.json();
        })
        .then((savedTask) => {
          setTasks((prev) => [...prev, savedTask]);
        });

      setNewTask("");
    }
  };

  const handletaskcompletion = (taskId) => {
    const toBeUpdatedTask = tasks.find((task) => task.id === taskId);
    const newIscompleted = !toBeUpdatedTask.iscompleted;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, iscompleted: !task.iscompleted } : task
      )
    );

    fetch(`/api/updateTask/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ iscompleted: newIscompleted }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update... line 63");
        }
        return res.json();
      })
      .then((data) => console.log(data));
  };

  const handleDeleteTask = (taskId) => {
    fetch(`/api/deleteTask/${taskId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => setTasks(tasks.filter((task) => task.id !== taskId)));
  };

  return (
    <div className="App">
      <div className="sm:mt-[55px] w-screen h-screen sm:w-[600px] sm:h-[845px] bg-white sm:rounded-t-3xl scrollable">
        <h1 className="heading-cust text-center bg-[#342c21] py-7 font-semibold text-5xl text-[#ab9f88]  ">
          Task It
        </h1>
        <h1 className="py-7 font-bold text-3xl ps-6 text-[#5c5443]">
          Add a Task
        </h1>
        <hr className="border-1 border-[#5c5443] w-[95%] mx-auto " />
        <div className="flex justify-center items-center flex-col">
          <input
            type="text"
            placeholder="Add a task here"
            value={newTask}
            className=" w-[87%] sm:w-[465px] mt-4 px-3 py-2 border-2 border-[#5c5443] rounded-lg font-mono text-lg font-semibold"
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            onClick={handleAddTask}
            className=" mt-4 px-6 py-2 bg-[#4b3f2d] text-center text-xl font-semibold text-[#ab9f88]  border-2 border-[#483511] rounded-xl "
          >
            Add Task
          </button>
        </div>

        <h1 className="py-7 font-bold text-3xl ps-6 text-[#5c5443]">
          Current Tasks
        </h1>
        <ul className="ps-7 pb-3 text-xl">
          {tasks
            .filter((task) => !task.iscompleted)
            .map((task) => (
              <li
                className={`cust-list flex font-mono items-center ${
                  task.iscompleted ? "line-through opacity-50" : ""
                }`}
                key={task.id}
              >
                <input
                  className="me-6 w-4 h-4"
                  type="checkbox"
                  checked={task.iscompleted}
                  onChange={() => handletaskcompletion(task.id)}
                />
                {task.name}
                {/* --------------------------delete button-------------------------- */}
                <button
                  className="ml-auto me-16 text-sm font-semibold text-[#4b3f2d] border-2 border-[#483511] py-1 px-4 rounded-2xl hover:bg-[#4b3f2d] hover:text-white "
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
        <hr className="border-1 border-[#5c5443] w-[95%] mx-auto " />

        <h1 className="py-7 mt-7 font-bold text-3xl ps-6 text-[#5c5443]">
          Completed Tasks
        </h1>
        <ul className="ps-7 pb-3 text-xl">
          {tasks
            .filter((task) => task.iscompleted)
            .map((task) => (
              <li
                className={`cust-list flex ${
                  task.iscompleted ? "line-through opacity-50" : ""
                }`}
                key={task.id}
              >
                <input
                  className="me-6"
                  type="checkbox"
                  checked={task.iscompleted}
                  onChange={() => handletaskcompletion(task.id)}
                />
                {task.name}
                {/* --------------------------delete button-------------------------- */}
                <button
                  className=" ml-auto me-16 text-sm font-semibold text-[#4b3f2d] border-2 border-[#483511] py-1 px-4 rounded-2xl hover:bg-[#4b3f2d] hover:text-white  "
                  style={{
                    opacity: "1 !important",
                    textDecoration: "none !important",
                  }}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
        <hr className="border-1 border-[#5c5443] w-[95%] mx-auto " />
      </div>
    </div>
  );
}

export default App;
