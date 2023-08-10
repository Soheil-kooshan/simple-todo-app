import { useEffect, useState } from "react";

function App() {
  const [tasks, setTask] = useState(function () {
    const stroredTasks = localStorage.getItem("tasks");
    return JSON.parse(stroredTasks);
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [formIsOpen, setFormIsOpen] = useState(false);

  function handleSelectedTask(task) {
    setSelectedTask(task);
  }

  function handleEdit(input) {
    const index = tasks.findIndex((task) => task === selectedTask);
    tasks[index].title = input;
  }

  function AddNewTask(newTask) {
    setTask([...tasks, newTask]);
    console.log(newTask);
  }

  function handleIsOpenForm() {
    setFormIsOpen(!formIsOpen);
  }

  function handleRemove() {
    const afterRemove = tasks.filter((task) => {
      return task !== selectedTask;
    });
    setTask(afterRemove);
  }
  useEffect(function () {
    async function fetchTask() {
      const res = await fetch(`https://jsonplaceholder.typicode.com/todos/`);
      const data = await res.json();
      if (!localStorage.getItem("tasks")) {
        setTask(data);
      }
      console.log();
    }
    fetchTask();
  }, []);

  useEffect(
    function () {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    },
    [tasks]
  );

  return (
    <>
      <div className="app">
        <Sidebar>
          <Tasks tasks={tasks} handleSelectedTask={handleSelectedTask} />
        </Sidebar>
        {formIsOpen && (
          <Form
            AddNewTask={AddNewTask}
            selectedTask={selectedTask}
            tasks={tasks}
            handleRemove={handleRemove}
            handleEdit={handleEdit}
          />
        )}
      </div>
      {!formIsOpen ? (
        <button onClick={handleIsOpenForm}>New Task</button>
      ) : (
        <button onClick={handleIsOpenForm}>Close</button>
      )}
    </>
  );
}

export default App;

function Sidebar({ children }) {
  return (
    <div className="sidebar">
      <ul>{children}</ul>
    </div>
  );
}

function Form({
  AddNewTask,

  handleRemove,
  handleEdit,
}) {
  const [InputValue, setInputValue] = useState("");

  function handleInputValue(e) {
    setInputValue(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!InputValue) return;
    const newTask = {
      userId: 100,
      id: Math.floor(Math.random() * 1000),
      title: InputValue,
      completed: false,
    };
    AddNewTask(newTask);
    setInputValue("");
  }

  return (
    <div className="main">
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" value={InputValue} onChange={handleInputValue} />
        <button>Add</button>
        <button type="button" onClick={handleEdit}>
          Edit
        </button>
        <button type="button" onClick={handleRemove(InputValue)}>
          Remove
        </button>
      </form>
    </div>
  );
}

function Tasks({ tasks, handleSelectedTask }) {
  return (
    <div>
      {tasks &&
        tasks.map((task) => (
          <List
            task={task}
            handleSelectedTask={handleSelectedTask}
            tasks={tasks}
          />
        ))}
    </div>
  );
}

function List({ task, handleSelectedTask }) {
  const [taskCompleted, setTaskCompleted] = useState(task.completed);

  function handleTaskCompleted() {
    task.completed = !task.completed;
    setTaskCompleted(task.completed);
  }

  return (
    <li>
      <div onClick={() => handleSelectedTask(task)}>
        <h3>{task.title}</h3>
      </div>
      {taskCompleted ? (
        <input type="checkbox" checked onChange={handleTaskCompleted} />
      ) : (
        <input type="checkbox" onChange={handleTaskCompleted} />
      )}
    </li>
  );
}
