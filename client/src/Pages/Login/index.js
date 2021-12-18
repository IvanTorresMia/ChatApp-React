import React, { useContext } from "react";
import ChatContext from "../../utils/ChatContext";


const Login = () => {
  const context = useContext(ChatContext);




  return (
    <div className="join-container">
      <header className="join-header">
        <h1>
          <i className="fas fa-smile"></i> ChatCord
        </h1>
      </header>
      <main className="join-main">
        <form action="chat.html">
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              onChange={context.handleUserName}
              type="text"
              name="username"
              id="username"
              placeholder="Enter username..."
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="room">Room</label>
            <select name="room" id="room" onChange={context.handleChatRoom}>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="PHP">PHP</option>
              <option value="C#">C#</option>
              <option value="Ruby">Ruby</option>
              <option value="Java">Java</option>
            </select>
          </div>
          <button onClick={context.handleSubmit} type="button" className="btn">
            Join Chat
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
