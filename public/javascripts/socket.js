const socket = io();
socket.on("message", (msg) => {
  console.log(msg);
  document.querySelector("h1").innerText = msg;
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message// taking input from user, message is name of input:text
  // socket.emit("sendmsg", document.querySelector("#msg").value); // taking input from queryselector
  socket.emit("sendmsg", message.value);
});
