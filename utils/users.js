const users = [];

// adduser, remove user

// add user
exports.addUser = ({ id, username, room }) => {
  // clean data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // validate data
  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }

  // check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // validate username
  if (existingUser) {
    return {
      error: "Username is in use",
    };
  }

  // store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

// remove user
exports.removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id); // findIndex returns the index of matched user and if not matched returns -1

  if (index !== -1) {
    return users.splice(index, 1)[0]; // returns the removed user as object, without [0] it returns the removed user as array
  }
};

// get user
exports.getUser = (id) => {
  return users.find((user) => user.id === id); // returns the matched user as object and if not matched returns "undefined"
};

// get all users in room

exports.getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room); // returns all matched users as array and if not matched returns empty list
};