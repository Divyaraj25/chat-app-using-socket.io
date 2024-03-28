const express = require("express");
const app = express();
const http = require("node:http").createServer(app);
const io = require("socket.io")(http);
const path = require("node:path");
const routes = require("./routes/index");

const publicPath = path.join(__dirname, "public");
const viewsPath = path.join(__dirname, "views");

app.use(routes);
app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", viewsPath);

let click = 0;
let users = 0;

io.on("connect", (socket) => {
  users++;
  socket.on("sendmsg", (msg)=>{
    console.log(msg);
    socket.broadcast.emit("message", msg)
  })
  socket.emit('users', `Welcome ${socket.id}`)
  socket.broadcast.emit('users', `new user added ${socket.id}`)

  // problem : this disconnects when tab is closed and tab is switched
  socket.on('disconnect', ()=>{
    users--;
    socket.broadcast.emit('users', `user ${socket.id} left, users left ${users}`)
  })
});

http.listen(3000, () => {
  console.log("app is listening on port 3000");
});
