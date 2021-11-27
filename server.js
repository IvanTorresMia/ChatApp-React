const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const cors = require("cors");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = 4200 || process.env.PORT;

// set static folder
// app.use(express.static(path.join(__dirname, "public")));
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// global variable to save a reusable string
const botName = "ChatCord Bot";

// Run when a client connects
io.on("connect", (socket) => {
  console.log("new socket connection");
  socket.on("joinRoom", ({ username, room }) => {
    console.log(room, username);
    // here we are using the userJoin function from the user file
    // we are passing in the socket id username and room
    // this is where I would make a model and back end for this
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // console.log("here");
    // console.log(user);

    // after the user joins we emmit a message
    socket.emit("message", formatMessage(botName, "Welcome to the chat"));
    // broadacast when a user connects. this is for every client except for the current client
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );
    // Broadcast when a user connects
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

//   // Broadcast when a user connects
//   io.to(user.room).emit("roomUsers", {
//     room: user.room,
//     users: getRoomUsers(user.room),
//   });

  });




 
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    console.log(user)
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
