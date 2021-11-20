const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io")

const app = express();
const server = http.createServer(app)
const io = socketio(server);

const PORT = 3000 || process.env.PORT;

// set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Run when a client connects
io.on('connect', socket => {
    console.log("new socket connection")
})

server.listen(PORT, () => console.log("Server is listening on port " + PORT));