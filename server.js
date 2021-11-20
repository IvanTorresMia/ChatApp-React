const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io")
const formatMessage = require('./utils/messages');
const { format } = require("path/posix");

const app = express();
const server = http.createServer(app)
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot'

// Run when a client connects
io.on('connect', socket => {
    console.log("new socket connection")




    socket.emit("message", formatMessage(botName, 'Welcome to the chat'));

    // broadacast when a user connects. this is for every client except for the current client
    socket.broadcast.emit("message", formatMessage(botName, "A user has joined the chat"));

    // this will run when the user disconnects
    socket.on("disconnect", () => {
        io.emit("message", formatMessage(botName, "User has disconnected"));
    });

    // listen for chat message
    socket.on("chatMessage", (msg) => {
        io.emit("message", formatMessage('USER', msg))
    })

})

server.listen(PORT, () => console.log("Server is listening on port " + PORT));