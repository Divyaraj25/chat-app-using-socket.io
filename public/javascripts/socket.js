const socket = io();
socket.on("message", (msg) => {
  console.log(msg);
  document.querySelector("h1").innerText = msg;
});

socket.on("clicked", (click) => {
  console.log(`the count has been updated ${click}`);
});

document.querySelector("button").addEventListener("click", () => {
  console.log("clicked");
  socket.emit("increment");
});
