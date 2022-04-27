import http from "http";
import express from "express";
import { Server } from "socket.io";
const app = express();

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);
app.use("/public", express.static(`${__dirname}/public`));

app.get("/", (req, res) => res.render("home"));
app.get("*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(event);
  });
  socket.on("enterRoom", (message, done) => {
    socket.join(message.payload);
    done();
    socket.to(message.payload).emit("welcome");
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });
});

server.listen(8080, () => {
  console.log("Listening on 8080");
});
