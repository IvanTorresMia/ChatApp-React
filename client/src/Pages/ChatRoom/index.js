import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const ChatRoom = () => {

  const [users, setUsers] = useState([]);

  const socket = socketIOClient.connect("http://localhost:4200");
  useEffect(() => {
    socket.on("roomUsers", ({ room, users }) => {
      console.log(users);
      // setUsers(users)
      
    }); 
  }, []);

  // const showUsers = () => {
  //   console.log(users);
  // }




  return (
    <div className="chat-container">
      {/* <!-- header with a buttom to leave --> */}
      <header className="chat-header">
        <h1>
          <i className="fas fa-smile"></i> ChatCord
        </h1>
        <a id="leave-btn" className="btn">
          Leave Room
        </a>
      </header>

      {/* <!-- this is the side nave with the room name and a list of users --> */}
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3>
            <i className="fas fa-comments"></i> Room Name:
          </h3>
          <h2 id="room-name"></h2>
          <h3>
            <i className="fas fa-users"></i> Users
          </h3>
          <ul id="users"></ul>
        </div>
        {/* <!-- this is where all the messages will go to --> */}
        <div className="chat-messages"></div>
      </main>
      {/* <!-- This form simply contains the input and button to submit a message --> */}
      <div className="chat-form-container">
        <form id="chat-form">
          <input
            id="msg"
            type="text"
            placeholder="Enter Message"
            required
            autoComplete="off"
          />
          <button className="btn">
            <i className="fas fa-paper-plane"></i> Send
          </button>
          {/* <button onClick={showUsers} >click me</button> */}
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
