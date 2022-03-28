const socket = new WebSocket(`ws://${window.location.host}`);
socket.addEventListener("open", () => {
  console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
  const { data } = message;
  console.log(data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from connection");
});

setInterval(() => {
  socket.send("Hi");
}, 1000);
