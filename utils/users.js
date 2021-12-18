const users = [
  {
    id: 1,
    username: "ivan",
    room: "Js"
  },
  {
    id: 2,
    username: "angel",
    room: "Js"
  },
  {
    id: 3,
    username: "josh",
    room: "Js"
  }
];
// join user to chat

function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

function userLeave(id) {
  // if the user id equlas to this then return him
  const index = users.findIndex((user) => user.id === id);

  // then take him off.
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

console.log(userLeave(2));


// get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
