const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

// explain this code
// we create a server using the http module and pass in our express app
// we then create a socket.io server and pass in our http server
// we then listen for a connection event and log the socket id of the user
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  let ids = [];

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
    ids.push(data);
  });

  socket.on("test_action", ({ name }, callback) => {
    console.log(`test action: Hello there ${name}`);
    callback("Hello there");
    // socket.disconnect();
  });

  socket.on("send_message", (data) => {
    // expalin this code
    // we emit a receive_message event to all users in the room
    // we pass in the data we received from the send_message event
    // this data contains the message and the room
    // we then listen for the receive_message event on the client side
    // and display the message
    // expalin socket.to method
    // this method is used to send a message to all users in a room except the user who sent the message
    // this is because the user who sent the message already has the message
    // so we don't need to send it to them again
    // redirecting to the room and emitting a receive_message event
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("ask_for_join", ({ room }, callback) => {
    const roomExists = ids.includes(room);
    if (roomExists) {
      callback(true);
    } else {
      callback(false);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log("SERVER RUNNING");
});
