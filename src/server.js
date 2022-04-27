import http from "http";
import express from "express";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);
app.use("/public", express.static(`${__dirname}/public`));

app.get("/", (req, res) => res.render("home"));
app.get("*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(io, {
  auth: false,
});

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const result = [];
  rooms.forEach((_, key) => {
    if (!sids.get(key)) {
      result.push(key);
    }
  });
  return result;
};

const countRoom = (roomName) => {
  return io.sockets.adapter.rooms.get(roomName)?.size;
};

io.on("connection", (socket) => {
  socket["nickname"] = "anonymous";
  socket.onAny((event) => {
    console.log(event);
  });
  socket.on("enterRoom", (message, done) => {
    socket.join(message.payload);
    done();
    socket
      .to(message.payload)
      .emit("welcome", socket.nickname, countRoom(message.payload));
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
});

server.listen(8080, () => {
  console.log("Listening on 8080");
});
