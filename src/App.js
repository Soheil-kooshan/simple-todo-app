import { useEffect, useState } from "react";

function App() {
  const [tasks, setTask] = useState();
  const [selectedTask, setSelectedTask] = useState(null);
  const [formIsOpen, setFormIsOpen] = useState(false);

  function handleSelectedTask(task) {
    setSelectedTask(task);
  }

  function AddNewTask(newTask) {
    setTask([...tasks, newTask]);
    console.log(newTask);
  }

  function handleIsOpenForm() {
    setFormIsOpen(!formIsOpen);
  }

  useEffect(function () {
    async function fetchTask() {
      const res = await fetch(`https://jsonplaceholder.typicode.com/todos/`);
      const data = await res.json();
      setTask(data);
    }
    fetchTask();
  }, []);

  return (
    <>
      <div className="app">
        <Sidebar>
          <Tasks tasks={tasks} handleSelectedTask={handleSelectedTask} />
        </Sidebar>
        {formIsOpen && <Form AddNewTask={AddNewTask} />}
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

function Form({ AddNewTask }) {
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
        <button type="button">Edit</button>
        <button type="button">Remove</button>
      </form>
    </div>
  );
}

function Tasks({ tasks, handleSelectedTask }) {
  return (
    <div>
      {tasks &&
        tasks.map((task) => (
          <List task={task} handleSelectedTask={handleSelectedTask} />
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
