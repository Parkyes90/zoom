const socket = io();

const welcome = document.querySelector("#welcome");
const form = document.querySelector("form");

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enterRoom", { payload: input.value });
  form.reset();
};

form.addEventListener("submit", handleRoomSubmit);
