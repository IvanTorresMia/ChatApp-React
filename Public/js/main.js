
// global hooks including the chat room, the messages contaiers and room name as we will append stuff to here
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// instalce of sockdt io. we have access to this because of the script tag that we added. 
const socket = io();

// Join chatroom and send the current user and the room that is being chosen
socket.emit('joinRoom', { username, room });

// Get room and users getting all the users in that room
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server the message to be appended to the dom ? 
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down after message is appended scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit this will handle the submit when the mesage is being submitted
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;


  // deletes spaces from the beginning and the end
  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  // sending the message back to the emit
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// function to take in the new message and out put it to the chat app
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});