import React, { useEffect, useState } from "react";

const ChatRoom = ({
  room,
  users,
  messages,
  handleMessages,
  handleInputChange,
  socketUser,
  refresh,
  handleLeave
}) => {
  const [render, setReder] = useState({ count: 0 });
  useEffect(() => {
    setReder({ ...render, count: refresh.count + 1 });
    console.log("hi");
  }, [refresh]);

  return (
    <div className="chat-container">
      {/* <!-- header with a buttom to leave --> */}
      <header className="chat-header">
        <h1>
          <i className="fas fa-smile"></i> ChatCord
        </h1>
        <a id="leave-btn" className="btn" onClick={handleLeave}>
          Leave Room
        </a>
      </header>

      {/* <!-- this is the side nave with the room name and a list of users --> */}
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3>
            <i className="fas fa-comments"></i> Room Name:
          </h3>
          <h2 id="room-name">{room}</h2>
          <h3>
            <i className="fas fa-users"></i> Users
          </h3>
          <ul id="users">
            {users.map((user, i) => (
              <li key={i}>{user.username}</li>
            ))}
          </ul>
        </div>
        {/* <!-- this is where all the messages will go to --> */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div className="message" key={i}>
              <p className="meta">{msg.username}</p>
              <span>{msg.time}</span>
              <p className="text">{msg.text}</p>
            </div>
          ))}
        </div>
      </main>
      {/* <!-- This form simply contains the input and button to submit a message --> */}
      <div className="chat-form-container">
        <form id="chat-form" onSubmit={handleMessages}>
          <input
            id="msg"
            type="text"
            placeholder="Enter Message"
            required
            autoComplete="off"
            onChange={handleInputChange}
          />
          <button className="btn" type="submit">
            <i className="fas fa-paper-plane"></i> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
