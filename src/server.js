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
  socket.on("join_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
});

server.listen(8080, () => {
  console.log("Listening on 8080");
});
