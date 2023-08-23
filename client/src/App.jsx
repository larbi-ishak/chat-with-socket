import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const test_socket_action = () => {
    socket.emit("test_action", { name: username }, (res) => {
      if (res == "ok") console.log("ok");
      else console.log("not ok");
    });
  };

  const ask_for_join = () => {
    socket.emit("ask_for_join", { room }, (response) => {
      if (response === true) {
        setShowChat(true);
      } else if (response === false) {
        setMessage("Room does not exist.");
      }
    });
  };
  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
          <button onClick={test_socket_action}>test Action</button>
          <button onClick={ask_for_join}>ask for join</button>
          <h3>{message}</h3>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
