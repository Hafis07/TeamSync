import { useEffect, useState } from "react";
import API from "../api/axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("tasks/notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div
      className="container-fluid px-5 py-5"
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
      }}
    >
      {/* Header */}
      <div
        className="card border-0 shadow-lg mb-4"
        style={{
          borderRadius: "20px",
          background: "linear-gradient(90deg,#2563eb,#3b82f6)",
        }}
      >
        <div className="card-body text-white">
          <h2 className="mb-0 fw-bold">
            <i className="bi bi-bell-fill me-2"></i>
            Notifications
          </h2>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div
          className="card border-0 shadow-lg text-center p-5"
          style={{ borderRadius: "20px" }}
        >
          <i
            className="bi bi-bell-slash text-primary"
            style={{ fontSize: "70px" }}
          ></i>

          <h3 className="mt-4 fw-bold">
            No Notifications
          </h3>

          <p className="text-muted fs-5">
            You're all caught up.
          </p>
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className="card border-0 shadow-lg mb-4 notification-card"
            style={{
              borderRadius: "18px",
              borderLeft: notification.is_read
                ? "6px solid #6c757d"
                : "6px solid #0d6efd",
            }}
          >
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-start">

                <div>

                  <h5 className="fw-bold">
                    <i className="bi bi-bell-fill text-warning me-2"></i>
                    {notification.message}
                  </h5>

                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i>

                    {new Date(
                      notification.created_at
                    ).toLocaleString()}
                  </small>

                </div>

                <span
                  className={`badge ${
                    notification.is_read
                      ? "bg-secondary"
                      : "bg-success"
                  }`}
                >
                  {notification.is_read
                    ? "Read"
                    : "Unread"}
                </span>

              </div>

            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;