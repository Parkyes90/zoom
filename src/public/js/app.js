const socket = new WebSocket(`ws://${window.location.host}`);
socket.addEventListener("open", () => {
  console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
  console.log(message);
});

socket.addEventListener("close", () => {
  console.log("Closed connection");
});
