import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();

    console.log("Before request");
    console.log("Username =", username);
    console.log("Password =", password);

    try {
      const res = await API.post("login/", {
        username,
        password,
      });

      console.log("Response:", res.data);

      // Save JWT tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      localStorage.setItem("user_id", res.data.user.id);
localStorage.setItem("username", res.data.user.username);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      console.log("ERROR:", err);
      console.log("Response:", err.response);
      console.log("Data:", err.response?.data);

      alert(
        err.response?.data?.detail ||
          "Invalid Username or Password"
      );
    }
  };

  return (
    <div
      style={{
        width: "350px",
        margin: "100px auto",
        textAlign: "center",
      }}
    >
      <h1>TeamSync Login</h1>

      <form onSubmit={login}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;