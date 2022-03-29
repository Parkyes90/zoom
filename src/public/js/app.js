const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`);
socket.addEventListener("open", () => {
  console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
  const { data } = message;
  const li = document.createElement("li");
  li.innerText = data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from connection");
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(input.value);
  messageForm.reset();
});
