const socket = io();
socket.on("message", (msg) => {
  console.log(msg);
  document.querySelector("h1").innerText = msg;
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("sendmsg", document.querySelector("#msg").value);
});
