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

const db = require("./models");

app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3006",
    methods: ["GET", "POST"],
  },
});

const PORT = 4200 || process.env.PORT;

// commented out access to public folder incase needed
// set static folder
// app.use(express.static(path.join(__dirname, "public")));
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// global variable to save a reusable string
const botName = "ChatCord Bot";

// Run when a client connects
io.on("connect", (socket) => {
  console.log("new socket connection");

  // Join connection
  socket.on("joinRoom", ({ username, room }) => {
    // here we are using the userJoin function from the user file
    // we are passing in the socket id username and room
    // this is where I would make a model and back end for this
    // const user = userJoin(socket.id, username, room);

    db.User.create({
      username: username,
      room: room,
    }).then((res) => {
      console.log(res.dataValues.room);
      let user = res.dataValues;
      // console.log(user);
      socket.join(user.room);

      // after the user joins we emmit a message
      socket.emit("message", formatMessage(botName, "Welcome to the chat"));
      // broadacast when a user connects. this is for every client except for the current client
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          formatMessage(botName, `${user.username} has joined the chat`)
        );


      db.User.findAll({}).then(response => {
    // Broadcast when a user connects
    console.log(response)
    // io.to(user.room).emit("roomUsers", {
    //   room: user.room,
    //   // users: getRoomUsers(user.room),
    //   users: 
    // });
      })

  
    });
  });

  // chat message connection
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    console.log(user);
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

db.sequelize.sync({ force: true }).then(() => {
  server.listen(PORT, () => console.log("Server is listening on port " + PORT));
});
