const messageList = document.querySelector("ul");
const nicknameForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");

const socket = new WebSocket(`ws://${window.location.host}`);

const stringifyWebsocketMessage = (type, payload) => {
  return JSON.stringify({ type, payload });
};

socket.addEventListener("open", () => {
  console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
  const { data } = message;
  const jsonData = JSON.parse(data);
  const li = document.createElement("li");
  li.innerText = jsonData.payload;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from connection");
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(stringifyWebsocketMessage("message", input.value));
  messageForm.reset();
});

nicknameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  socket.send(stringifyWebsocketMessage("nickname", input.value));
});
