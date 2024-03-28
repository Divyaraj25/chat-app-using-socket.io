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

io.on("connect", (socket) => {
  socket.on("sendmsg", (msg)=>{
    console.log(msg);
    socket.broadcast.emit("message", msg)
  })
});

http.listen(3000, () => {
  console.log("app is listening on port 3000");
});
