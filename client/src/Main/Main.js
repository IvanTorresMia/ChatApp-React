import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Login from "../Pages/Login";
import ChatContext from "../utils/ChatContext";
import ChatRoom from "../Pages/ChatRoom";
import { Routes, Route, useNavigate } from "react-router-dom";

const socket = socketIOClient.connect("http://localhost:4200");

const Main = () => {
  const [username, setChatName] = useState("");
  const [room, setChatRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [roomName, setRoomName] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [resfresh, setRefresh] = useState({ count: 0 });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { value } = e.target;
    setNewMessage(value);
  };

  const handleMessages = (e) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    // console.log(socket);
    if (!trimmed) {
      return false;
    }
    socket.emit("chatMessage", trimmed);

    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
  };

  const chatContextObj = {
    handleUserName: (e) => {
      const { value } = e.target;
      setChatName(value);
      // console.log(username);
    },
    handleChatRoom: (e) => {
      const { value } = e.target;
      setChatRoom(value);
      // console.log(room);
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

  const handleLeave = () => {
    const leaveRoom = window.confirm(
      "Are you sure you want to leave the chatroom?"
    );
    if (leaveRoom) {
      socket.disconnect();
      navigate("/");
    } else {
    }
  };

  useEffect(() => {
    console.log("connection works");
    socket.on("roomUsers", ({ room, users }) => {
      // console.log(users);
      const userNames = users.map(u => u.username);
      setUsers(userNames);
      setRoomName(room);
    });

    socket.on("message", (message) => {
      messages.push(message);
      setRefresh({ ...resfresh, count: resfresh.count + 1 });
      // Scroll down after message is appended scroll down
      const chatMessages = document.querySelector(".chat-messages");
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }, [socket]);


  return (
    <div>
      <ChatContext.Provider value={chatContextObj}>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route
            path="/chat"
            element={
              <ChatRoom
                room={roomName}
                users={users}
                messages={messages}
                handleInputChange={handleInputChange}
                handleMessages={handleMessages}
                socketUser={socket}
                refresh={resfresh}
                handleLeave={handleLeave}
              />
            }
          />
        </Routes>
      </ChatContext.Provider>
    </div>
  );
};

export default Main;
