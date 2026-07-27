import { useEffect, useState } from "react";
import API from "../api/axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);

  const [activities, setActivities] = useState({});
  const [selectedActivityTask, setSelectedActivityTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      let url = "tasks/workspace/1/?";

      if (search) url += `search=${search}&`;
      if (statusFilter) url += `status=${statusFilter}&`;
      if (priorityFilter) url += `priority=${priorityFilter}&`;

      const res = await API.get(url);

      setTasks(res.data);

      res.data.forEach((task) => {
        fetchComments(task.id);
      });

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const fetchComments = async (taskId) => {
    try {
      const res = await API.get(`tasks/comments/${taskId}/`);

      setComments((prev) => ({
        ...prev,
        [taskId]: res.data,
      }));

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const fetchActivities = async (taskId) => {
    try {
      const res = await API.get(`tasks/activity/${taskId}/`);

      setActivities((prev) => ({
        ...prev,
        [taskId]: res.data,
      }));

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const addComment = async (taskId) => {
    try {

      await API.post(`tasks/comments/${taskId}/`, {
        content: newComment[taskId],
      });

      setNewComment((prev) => ({
        ...prev,
        [taskId]: "",
      }));

      fetchComments(taskId);

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {

      await API.post("tasks/workspace/1/", {
        title,
        priority,
        due_date: dueDate,
        status: "todo",
      });

      setTitle("");
      setPriority("medium");
      setDueDate("");

      fetchTasks();

    } catch (err) {
      console.log(err.response?.data);
      alert("Failed to create task");
    }
  };

  const updateTask = async (task, status) => {

    try {

      await API.put(`tasks/${task.id}/`, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: status,
        due_date: task.due_date,
        assigned_to: task.assigned_to,
        workspace: task.workspace,
      });

      fetchTasks();

    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const deleteTask = async (id) => {

    if (!window.confirm("Delete this task?")) return;

    try {

      await API.delete(`tasks/${id}/`);

      fetchTasks();

    } catch (err) {
      console.log(err.response?.data);
    }
  };

    return (
    <div 
      className="container py-5"
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
      }}
    >

      <h2 className="fw-bold mb-4">
           <i className="bi bi-list-task me-2 text-primary"></i>
           Task Management
      </h2>

      {/* Add Task */}

      <div
         className="card border-0 shadow-lg mb-4"
         style={{
           borderRadius:"20px"
         }}
      >

        <div className="card-header bg-primary text-white">
          Add New Task
        </div>

        <div className="card-body">

          <form onSubmit={createTask}>

            <div className="row">

              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Task Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div
                 className="col-md-2 mb-3"
                 style={{
                    borderRadius:"20px"
                 }}
              >
                <button
                  type="submit"
                  className="btn btn-success w-100"
                >
                  Add Task
                </button>
              </div>

            </div>

          </form>

        </div>

      </div>

      {/* Search */}

      <div 
         className="card border-0 shadow-lg mb-4"
         style={{
             borderRadius:"20px"
         }}
      >

        <div className="card-header bg-dark text-white">
          Search & Filter
        </div>

        <div className="card-body">

          <div className="row">

            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="todo">Todo</option>
                <option value="progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="col-md-2">
              <button
                className="btn btn-secondary w-100"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setPriorityFilter("");
                }}
              >
                Clear
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Tasks */}

      <div className="row">

        {tasks.map((task) => (
          <div className="col-md-6 col-lg-4 mb-4" key={task.id}>

            <div
               className="card border-0 shadow-lg task-card h-100"
               style={{ borderRadius: "18px" }}
            >

               <div className="card-body">

                <h5 className="fw-bold mb-3">
                  <i className="bi bi-list-task text-primary me-2"></i>
                  {task.title}
                </h5>

                <p>
                  <strong>Priority:</strong>{" "}
                  <span
                    className={`badge ${
                      task.priority === "high"
                      ? "bg-danger"
                      :task.priority === "medium"
                      ? "bg-warning text-dark"
                      : "bg-success"
                    }`}
                  >
                    {task.priority}
                  </span>
                </p>

                <p>
                  <strong>Due:</strong> {task.due_date || "Not set"}
                </p>

                <div className="mb-3">

                  <label className="form-label fw-semibold">
                    Status
                  </label>

                  <select
                    className="form-select"
                    value={task.status}
                    onChange={(e) =>
                      updateTask(task, e.target.value)
                    }
                  >

                    <option value="todo">📝 Todo</option>
                    <option value="progress">🚀 In Progress</option>
                    <option value="done">✅ Done</option>
                  </select>


                </div>

                <div className="d-flex justify-content-between">

                  <button
                     className="btn btn-danger btn-sm rounded-pill"
                     onClick={() => deleteTask(task.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>

                  <button
                     className="btn btn-primary btn-sm rounded-pill"
                     onClick={() => {
                      setSelectedTask(task.id);
                      fetchComments(task.id);
                     }}
                  >
                    <i className="bi bi-chat-dots"></i>
                  </button>

                  <button
                     className="btn btn-warning btn-sm rounded-pill"
                     onClick={() => {
                      setSelectedActivityTask(task.id);
                      fetchActivities(task.id);
                     }}
                  >
                    <i className="bi bi-clock-history"></i>
                  </button>

                </div>
              </div>
            </div>
          </div>

        ))}

      </div>


      {selectedTask && (

        <div className="card mt-4">

          <div className="card-header bg-primary text-white">
            Comments
          </div>

          <div className="card-body">

            {(comments[selectedTask] || []).map((comment) => (

              <div
                key={comment.id}
                className="border rounded p-2 mb-2"
              >
                <strong>{comment.username}</strong>
                <br />
                {comment.content}
              </div>

            ))}

            <div className="input-group">

              <input
                className="form-control"
                placeholder="Write a comment..."
                value={newComment[selectedTask] || ""}
                onChange={(e) =>
                  setNewComment({
                    ...newComment,
                    [selectedTask]: e.target.value,
                  })
                }
              />

              <button
                className="btn btn-success"
                onClick={() => addComment(selectedTask)}
              >
                Send
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Activity */}

      {selectedActivityTask && (

        <div className="card mt-4">

          <div className="card-header bg-warning">
            Activity Timeline
          </div>

          <div className="card-body">

            {(activities[selectedActivityTask] || []).length === 0 ? (

              <p>No activity found.</p>

            ) : (

              (activities[selectedActivityTask] || []).map((activity) => (

                <div
                  key={activity.id}
                  className="border-start border-4 border-warning ps-3 mb-3"
                >

                  <strong>{activity.username}</strong>

                  <br />

                  {activity.action}

                  <br />

                  <small className="text-muted">
                    {new Date(activity.created_at).toLocaleString()}
                  </small>

                </div>
                              ))
            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default Tasks;