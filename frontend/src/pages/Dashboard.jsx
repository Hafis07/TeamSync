import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("dashboard/");
      setStats(res.data);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav
       className="navbar navbar-expand-lg navbar-dark shadow"
        style={{
          backgroundColor: "linear-gradient(90deg, #2563eb,#1d4ed8)",
        }}
      >
        <div className="container">

          <Link
            className="nav-link text-dark fw-semibold"
            to="/dashboard">
              <i className="bi bi-kanban-fill me-2"></i>
              TeamSync
          </Link>

          <div className="navbar-collapse">

            <ul className="navbar-nav ms-auto">

              <li className="nav-item">
                <Link
                  className="nav-link text-dark fw-semibold"
                  to="/dashboard">
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link text-dark fw-semibold"
                  to="/tasks">
                  Tasks
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link text-dark fw-semibold"
                  to="#">
                  Workspace
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link text-dark fw-semibold"
                  to="/chat">
                  Chat
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link text-dark fw-semibold"
                  to="/notifications">
                  🔔 Notifications
                </Link>
              </li>

              <li className="nav-item ms-3">
                <button
                  className="btn btn-danger"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>

            </ul>

          </div>

        </div>
      </nav>

      {/* Dashboard */}
      <div className="container mt-5">

        <h3 className="fw-bold mb-4">
          📊 Dashboard Overview
        </h3>

        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            background: "20px",
            background: "linear-gradient(135deg, #2563eb,#60a5fa)",
            color: "white",
          }}
        >
          <div className="card-body p-4">

            <h2 className="fw-bold">
              Welcome back, {username} 👋
            </h2>
            <p className="mb-0">
              Here's a quick overview of your workspace.
            </p>
          </div>
        </div>

        <div className="row">

          <div className="col-md-3 mb-3">
             <div
               className="card border-0 shadow-lg text-white h-100"
               style={{
                 borderRadius: "20px",
                 background: "linear-gradient(135deg,#2563eb,#3b82f6)",
               }}
             >
               <div className="card-body text-center d-flex flex-column justify-content-center">
                 <h5>📝 Total Tasks</h5>

                 <h1 className="fw-bold display-4">
                   {stats.total_tasks}
                 </h1>
               </div>
             </div>
           </div>

          <div className="col-md-3 mb-3">
            <div
             className="card border-0 shadow-lg text-white"
             style={{
              borderRadius: "20px",
              background:
                "linear-gradient(135deg,#16a34a,#22c55e)",
             }}
            >
                      

              <div className="card-body text-center">
                <h5>✅ Completed</h5>
                <h1 className="fw-bold display-5">{stats.completed_taks}</h1>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div
             className="card border-0 shadow-lg"
             style={{
              borderRadius:"20px",
              background:
                 "linear-gradient(135deg,#f59e0b,#fbbf24)",
             }}
            >

              <div className="card-body text-center">
                <h5>⏳ Pending</h5>
                <h2>{stats.pending_tasks}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div
              className="card border-0 shadow-lg text-white"
              style={{
                borderRadius: "20px",
                background:
                   "linear-gradient(135deg,#0891b2,#06b6d4)",
              }}
            >
              <div className="card-body text-center">
                <h5>🚀 In Progress</h5>
                <h1 className="fw-bold display-5">{stats.in_progress_tasks}</h1>
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}

export default Dashboard;