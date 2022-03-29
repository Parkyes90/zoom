import http from "http";
import express from "express";
import ws from "ws";
const app = express();

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);
app.use("/public", express.static(`${__dirname}/public`));

app.get("/", (req, res) => res.render("home"));
app.get("*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const wss = new ws.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  socket.nickname = "anonymous";
  console.log("Connected to Browser");
  socket.on("close", () => {
    console.log("Disconnected from Browser");
  });
  socket.on("message", (rawData, isBinary) => {
    const message = isBinary ? rawData : rawData.toString();
    const jsonMessage = JSON.parse(message);
    switch (jsonMessage.type) {
      case "message":
        sockets.forEach((aSocket) => {
          jsonMessage.payload = `${socket.nickname}: ${jsonMessage.payload}`;
          aSocket.send(JSON.stringify(jsonMessage));
        });
        break;
      case "nickname":
        socket.nickname = jsonMessage.payload;
        break;
      default:
        throw Error("Invalid type");
    }
  });
  sockets.push(socket);
});

server.listen(3000, () => {
  console.log("Listening on 3000");
});
