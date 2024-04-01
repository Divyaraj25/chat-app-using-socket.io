const express = require("express");
const app = express();
const http = require("node:http").createServer(app);
const io = require("socket.io")(http);
const path = require("node:path");
const routes = require("./routes/index");
const { generateMsgs, generateLocations } = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const publicPath = path.join(__dirname, "public");
const viewsPath = path.join(__dirname, "views");

app.use(routes);
app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", viewsPath);

let click = 0;

io.on("connect", (socket) => {
  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    console.log(user.username, user.room);
    socket.join(user.room);

    // socket.to(user.room).emit("users", `Welcome ${user.username}`);
    socket.emit("users", `Welcome ${user.username}`);
    socket.broadcast.to(user.room).emit("users", `new user added ${user.id}`);

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })

    console.log(getUsersInRoom(user.room));

    callback();
  });

  socket.on("sendmsg", (msg, callback) => {
    const user = getUser(socket.id);
    const { username, room } = user;
    console.log(msg);
    io.to(room).emit("message", generateMsgs(msg, username));
    callback();
  });

  // socket.on("eventname", (data, callback)=>{}) => callback is client side callback acknowledgement
  socket.on("sendlocation", (data, callback) => {
    const user = getUser(socket.id);
    const { username, room } = user;
    const { latitude, longitude } = data;
    console.log(data);
    console.log(typeof data);
    const jsondata = JSON.stringify(data);
    console.log(jsondata);
    console.log(typeof jsondata);
    callback("sharing....");
    io.to(room).emit(
      "location",
      generateLocations(
        `https://google.com/maps?q=${latitude},${longitude}`,
        username
      )
    );
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("users", `user left ${user.username}`);
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }
  });
});

http.listen(3000, () => {
  console.log("app is listening on port 3000");
});
