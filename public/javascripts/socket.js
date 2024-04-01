const socket = io();

// $ sign is only for convention for identifying dom elements and not necessary
const $messageForm = document.querySelector("form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("#sendmsg");
const $locationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const roomTemplate = document.querySelector("#room-template").innerHTML;

let { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }); // ignoreQueryPrefix ignores "?" in query

socket.on("message", (msg) => {
  console.log(msg);
  const html = Mustache.render(messageTemplate, {
    name: msg.name,
    messages: msg.text,
    createdAt: moment(msg.createdAt).format("h:mm a"), // h:mm a is 12 hour format => 12:30 pm and HH:mm:ss => 00:30:00
  });
  $messages.insertAdjacentHTML("beforeend", html); // afterbegin means before first element and beforeend means after last
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
  $locationButton.setAttribute("disabled", "disabled");
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
        $locationButton.removeAttribute("disabled");
      }
    );
  });
});

socket.on("location", (url) => {
  console.log(url);
  const html = Mustache.render(locationTemplate, {
    name: url.name,
    url: url.url,
    createdAt: moment(url.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }

    console.log('user joined')
})

socket.on('roomData', ({room, users})=>{
    console.log(room)
    console.log(users)

    const html = Mustache.render(roomTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML += html
})