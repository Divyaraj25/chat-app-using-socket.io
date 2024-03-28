const socket = io();
socket.on("message", (msg) => {
  console.log(msg);
  document.querySelector("h1").innerText = msg;
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message; // taking input from user, message is name of input:text
  socket.emit("sendmsg", message.value);
});

socket.on("users", (msg) => {
  console.log(msg);
});

document.querySelector("#send-location").addEventListener("click", () => {
  console.log("location sharing....");
  console.log(navigator.geolocation);
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    // socket.emit("eventname", data, "client side callback") => when server takes the data then gives acknowledgement then call the client side callback
    socket.emit(
      "sendlocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (msg) => {
        console.log("location shared " + msg);
      }
    );
  });
});

socket.on("location", (msg) => {
  console.log(msg);
});
