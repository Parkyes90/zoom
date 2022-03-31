const socket = io();

const welcome = document.querySelector("#welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");

let roomName;

room.hidden = true;

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enterRoom", { payload: input.value }, showRoom);
  roomName = input.value;
  form.reset();
};

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = "Someone Joined";
  ul.append(li);
});
