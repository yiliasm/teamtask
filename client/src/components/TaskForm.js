import { useState } from "react";
import axios from "axios";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    try {
      const res = await axios.post(
        "http://localhost:4000/api/tasks",
        {
          title,
          description,
          due_date: dueDate,
          created_by: userId,
          assigned_to: userId, // self assign for now
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Task created!");
      onTaskCreated(); 
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (err) {
      alert("Error creating task");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20, maxWidth: 400 }}>
      <h3>Create a New Task</h3>

      <input
        type="text"
        placeholder="Task title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <button type="submit" style={{ width: "100%", padding: 10 }}>
        Create Task
      </button>
    </form>
  );
}

export default TaskForm;
