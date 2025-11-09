import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    // check if logged in
    if (!storedToken) {
      window.location.href = "/";
      return;
    }

    setToken(storedToken);

    // decode token to get user ID
    const payload = JSON.parse(atob(storedToken.split(".")[1]));
    setUserId(payload.id);

    // fetch tasks after both are successful
    fetchTasks(payload.id, storedToken);
  }, []);

  const fetchTasks = async (id, jwtToken) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/tasks/${id}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` }
        }
      );
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

    return (
        <div style={{ padding: 40 }}>
        <h2>Your Tasks</h2>

        {tasks.length === 0 ? (
            <p>No tasks found.</p>
        ) : (
        <ul>
            {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: 10 }}>
                <strong>{task.title}</strong> — {task.status}
            </li>
            ))}
        </ul>
    )}

    <hr style={{ margin: "30px 0" }} />

    {userId && token && (
      <TaskForm onTaskCreated={() => fetchTasks(userId, token)} />
    )}
  </div>
);
}

export default Dashboard;
