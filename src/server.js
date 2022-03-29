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

wss.on("connection", (socket) => {
  console.log("Connected to Browser");
  socket.on("close", () => {
    console.log("Disconnected from Browser");
  });
  socket.on("message", (rawData, isBinary) => {
    const message = isBinary ? rawData : rawData.toString();
    socket.send(message);
  });
  socket.send("hello world");
});

server.listen(3000, () => {
  console.log("Listening on 3000");
});
