const socket = io();

const welcome = document.querySelector("#welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");

let roomName;

room.hidden = true;

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector("input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${input.value}`);
    input.value = "";
  });
};

const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.append(li);
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enterRoom", { payload: input.value }, showRoom);
  roomName = input.value;
  form.reset();
};

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  addMessage("Someone Joined");
});

socket.on("bye", () => {
  addMessage("Someone leaved");
});

socket.on("new_message", (message) => {
  addMessage(message);
});
