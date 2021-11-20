const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// global variable to save a reusable string
const botName = "ChatCord Bot";

// Run when a client connects
io.on("connect", (socket) => {
  console.log("new socket connection");

  socket.on("joinRoom", ({ username, room }) => {
    // here we are using the userJoin function from the user file
    // we are passing in the socket id username and room
    // this is where I would make a model and back end for this
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit("message", formatMessage(botName, "Welcome to the chat"));

    // broadacast when a user connects. this is for every client except for the current client
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );
  });

  // Broadcast when a user connects
  io.to(user.room).emit("roomUsers", {
    room: user.room,
    users: getRoomUsers(user.room),
  });

  // listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // this will run when the user disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has disconnected`)
      );
      // Broadcast when a user connects
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () => console.log("Server is listening on port " + PORT));
