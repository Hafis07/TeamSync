import { useEffect, useRef, useState } from "react";
import API from "../api/axios";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const userId = Number(localStorage.getItem("user_id"));
  const username = localStorage.getItem("username");

  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  // Load old messages + connect websocket
  useEffect(() => {
    fetchMessages();

    socket.current = new WebSocket("ws://127.0.0.1:8000/ws/chat/1/");

    socket.current.onopen = () => {
      console.log("WebSocket Connected");
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMessages((prev) => [
        ...prev,
        {
          sender: data.sender,
          username: data.username,
          message: data.message,
          attachment: data.attachment
            ? `http://127.0.0.1:8000${data.attachment}`
            : null,
          created_at: new Date(data.created_at).toLocaleString(),
        }
      ]);
    };

    socket.current.onerror = (error) => {
      console.log(error);
    };

    socket.current.onclose = () => {
      console.log("WebSocket Closed");
    };

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await API.get("chat/workspace/1/");
      console.log(res.data);

      setMessages(
        res.data.map((msg) => ({
          sender: msg.sender,
          username: msg.username,
          message: msg.content,
          attachment: msg.attachment,
          created_at: new Date(msg.created_at).toLocaleString(),
        }))
      );
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
      alert("WebSocket is not connected.");
      return;
    }

    socket.current.send(
      JSON.stringify({
        sender: userId,
        message: message,
      })
    );

    setMessage("");
  };

  const uploadFile = async () => {

    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();

    formData.append("attachment", selectedFile);
    formData.append("content", "");

    try {
        await API.post(
            "chat/workspace/1/",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        alert("File uploaded successfully.");

        setSelectedFile(null);

    } catch (err) {
        console.log("status:", err.response?.status);
        console.log("data:", err.response?.data);
        console.log(err);

        alert("File upload failed.");

    }

    };

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2f7 0%, #dbeafe 100%)",
      }}
    >


      <div
       className="card border-0 shadow-lg"
        style={{
          borderRadius: "22px",
          overflow: "hidden",
        }}
      >

        <div className="card-header bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                style={{
                  width: 48,
                  height: 48,
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                💬
              </div>

              <div>
                <h4 className="fw-bold mb-0">
                  Workspace Chat
                  </h4>

                <small className="text-muted">Collaborate in real time</small>
              </div>
            </div>

            <div className="text-end">
              <strong>{username}</strong>
              <br />
              <small className="text-muted">You</small>
            </div>
          </div>
        </div>

        <div
          className="card-body"
          style={{
            height: "500px",
            overflowY: "auto",
            background: "#eef2f7",
            padding: "20px",
            scrollbarWidth: "thin",
          }}
        >

          {messages.length === 0 ? (

            <div className="text-center text-muted mt-5">
              <h1>💬</h1>
              <h5>No messages yet</h5>
              <p>Start the conversation.</p>
            </div>

          ) : (

           messages.map((msg, index) => {
             const isMe = msg.sender === userId;

             return (
               <div
                 key={index}
                 className={`d-flex align-items-end mb-3 ${
                   isMe ? "justify-content-end" : "justify-content-start"
                 }`}
               >
                 <div
                   className={`p-3 rounded-4 shadow-sm ${
                     isMe ? "bg-primary text-white" : "bg-white border"
                   }`}
                   style={{
                     maxWidth: "75%",
                     minWidth: "140px",
                     borderRadius: "18px",
                   }}
                 >
                   <div className="fw-bold mb-1">
                     {isMe ? `You (${username})` : msg.username}
                   </div>

                   {msg.message && (
                     <div className="mt-2">
                       {msg.message}
                     </div>
                   )}

                   {msg.attachment && (
                     <div className="mt-2">
                       {msg.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                         <img
                           onClick={() => window.open(msg.attachment, "_blank")}
                           src={msg.attachment}
                           alt="attachment"
                           className="img-fluid rounded-3 shadow-sm mt-2"
                           style={{
                             maxWidth: "240px",
                             cursor: "pointer",
                           }}
                         />
                       ) : (
                         <a
                           href={msg.attachment}
                           target="_blank"
                           rel="noreferrer"
                          >
                           📎 Download File
                         </a>
                       )}
                     </div>
                   )}

                   <div className="text-end mt-2">
                     <small
                       className={isMe ? "text-white-50" : "text-secondary"}
                       style={{ fontSize: "12px" }}
                     >
                       {msg.created_at}
                                        </small>
                 </div>
               </div>
             </div>
           );
         })
        )}

        <div ref={messagesEndRef}></div>

      </div>

      <div className="card-footer">

        <div className="mb-3">

          <input
            type="file"
            className="form-control rounded-pill"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />

          {selectedFile && (
            <div className="alert alert-light border mt-2 rounded-3">
              📎 <strong>{selectedFile.name}</strong>
            </div>
          )}

        </div>

        <div className="d-flex gap-2 align-items-center">

          <input
            type="text"
            className="form-control rounded-pill"
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            className="btn btn-outline-success rounded-pill px-4"
            onClick={uploadFile}
          >
            📎 Attach
          </button>

          <button
            className="btn btn-primary rounded-circle"
            style={{
              width: 50,
              height: 50,
            }}
            onClick={sendMessage}
          >
            ➤
          </button>

        </div>

        <div className="text-center mt-2">
          <small className="text-muted">
            🔒 Secure workspace chat
          </small>
        </div>

      </div>

    </div>

  </div>
  );
}

export default Chat;