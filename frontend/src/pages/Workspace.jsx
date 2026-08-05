import { useState, useEffect } from "react";
import API from "../api/axios";

function Workspace() {
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchWorkspaces = async () => {
        try {
            const res = await API.get("workspaces/");

            if (res.data.length > 0) {
                localStorage.setItem("workspace_id", res.data[0].id);
            }
        } catch (err) {
          console.log(err.response?.data);  
        }
    };

    fetchWorkspaces();
  }, []);
  

  const createWorkspace = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("workspaces/", {
        name,
      });

      localStorage.setItem("workspace_id", res.data.id);

      alert("Workspace created successfully!");

      console.log(res.data);
    } catch (err) {
      console.log(err.response?.data);
      alert("Failed to create workspace");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Create Workspace</h2>

      <form onSubmit={createWorkspace}>
        <input
          type="text"
          placeholder="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Create Workspace
        </button>
      </form>
    </div>
  );
}

export default Workspace;