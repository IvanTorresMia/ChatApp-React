import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Login from "../Pages/Login";
import ChatContext from "../utils/ChatContext";
import ChatRoom from "../Pages/ChatRoom";
import { Routes, Route, useNavigate } from "react-router-dom";

const Main = () => {
  const [username, setChatName] = useState("");
  const [room, setChatRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [roomName, setRoomName] = useState();

  const socket = socketIOClient.connect("http://localhost:4200");
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const chatContextObj = {
    handleUserName: (e) => {
      const { value } = e.target;
      setChatName(value);
      // console.log(username);
    },
    handleChatRoom: (e) => {
      const { value } = e.target;
      setChatRoom(value);
      console.log(room);
    },
    handleSubmit: () => {
      // validating for username and room
      if (username !== "" && room !== "") {
        socket.emit("joinRoom", { username, room });
        navigate("/chat");
      } else {
        socket.emit("joinRoom", { username, room: "JavaScript" });
        navigate("/chat");
      }
    },
  };

  useEffect(() => {}, []);
  socket.on("roomUsers", ({ room, users }) => {
    setUsers(users);
    setRoomName(room);
  });

  return (
    <div>
      <ChatContext.Provider value={chatContextObj}>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route
            path="/chat"
            element={<ChatRoom room={roomName} users={users} />}
          />
        </Routes>
      </ChatContext.Provider>
    </div>
  );
};

export default Main;
