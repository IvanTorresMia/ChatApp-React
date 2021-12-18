const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const moment = require("moment");
const cors = require("cors");

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

const db = require("./models");

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

  console.log(socket.id);

  socket.on("joinRoom", ({ username, room }) => {


    db.User.create({
      username: username,
      room: room,
      socketId: socket.id,
    }).then((res) => {
      db.User.findAll({
        where: {
          room: res.dataValues.room,
        },
      }).then((response) => {
        socket.join(res.dataValues.room);

        socket.emit("message", formatMessage(botName, "Welcome to the chat"));

        socket.broadcast
          .to(res.dataValues.room)
          .emit(
            "message",
            formatMessage(
              botName,
              `${res.dataValues.username} has joined the chat`
            )
          );

        io.to(res.dataValues.room).emit("roomUsers", {
          room: res.dataValues.room,
          users: response,
        });
      });
    });
  });

  socket.on("chatMessage", (msg) => {
    db.User.findOne({
      where: {
        socketId: socket.id,
      },
    }).then((res) => {
      // console.log(res.dataValues);
      db.Message.create({
        text: msg,
        username: res.dataValues.username,
        timeSubmited: moment().format("h:mm a"),
        UserId: res.dataValues.id,
      }).then((response) => {
        let message = {
          username: response.dataValues.username,
          text: response.dataValues.text,
          time: response.dataValues.timeSubmited,
        };

        io.to(res.dataValues.room).emit("message", message);
      });
    });
  });

  // this will run when the user disconnects
  // start
  socket.on("disconnect", (reason) => {
    // const user = userLeave(socket.id);

    if (reason === "client namespace disconnect") {
      // console.log("hi");
      // console.log(reason);
      // console.log("disconnect was called");
      db.User.findOne({
        where: {
          socketId: socket.id,
        },
      }).then((userResponse) => {
        const user = userResponse.dataValues;

        if (user) {
          io.to(user.room).emit(
            "message",
            formatMessage(botName, `${user.username} has disconnected`)
          );
          db.User.destroy({
            where: {
              socketId: user.socketId,
            },
          }).then((res) => {
            db.User.findAll({
              where: {
                room: user.room,
              },
            }).then((roomUsers) => {
              // Broadcast when a user connects
              io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: roomUsers,
              });
            });
          });
        }
      });
    }
  });
  // end
});

db.sequelize.sync({ force: true }).then(() => {
  server.listen(PORT, () => console.log("Server is listening on port " + PORT));
});

// socket.join(user.room);

// after the user joins we emmit a message
// socket.emit("message", formatMessage(botName, "Welcome to the chat"));
// broadacast when a user connects. this is for every client except for the current client
// socket.broadcast
//   .to(user.room)
//   .emit(
//     "message",
//     formatMessage(botName, `${user.username} has joined the chat`)
//   );
// Broadcast when a user connects
// io.to(user.room).emit("roomUsers", {
//   room: user.room,
//   users: getRoomUsers(user.room),
// });

// db.User.destroy({
//   where: {
//     socketId: socket.id
//   }
// }).then(res => {
//   console.log("hi");
//   console.log(res);
//   console.log("Hello");
// });

// if (user) {
//   io.to(user.room).emit(
//     "message",
//     formatMessage(botName, `${user.username} has disconnected`)
//   );

//   // Broadcast when a user connects
//   io.to(user.room).emit("roomUsers", {
//     room: user.room,
//     users: getRoomUsers(user.room),
//   });
// }
