const socket = io();

// $ sign is only for convention for identifying dom elements and not necessary
const $messageForm = document.querySelector("form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("#sendmsg");
const $locationButton = document.querySelector("#send-location");

socket.on("message", (msg) => {
  console.log(msg);
  document.querySelector("h1").innerText = msg;
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message; // taking input from user, message is name of input:text
  socket.emit("sendmsg", message.value, () => {
    console.log("message sended");
    $messageFormInput.value = "";
    $messageFormInput.focus();
  });
});

socket.on("users", (msg) => {
  console.log(msg);
});

document.querySelector("#send-location").addEventListener("click", () => {
  // disable button
  $locationButton.setAttribute('disabled', 'disabled');
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
        $locationButton.removeAttribute('disabled');
      }
    );
  });
});

socket.on("location", (msg) => {
  console.log(msg);
});
