const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const rooms = {};
const snapshots = {};

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "..", "client")));

io.on("connection", (socket) => {
  const color = randomColor();

  // Send latest snapshot
  socket.on("requestLatest", () => {
    const s = snapshots.latest || null;
    if (s) socket.emit("snapshot", { snapshot: s });
  });

  // Handle draw event
  socket.on("draw", (ev) => {
    if (
      ev &&
      ev.from &&
      ev.to &&
      typeof ev.from.x === "number" &&
      typeof ev.from.y === "number" &&
      typeof ev.to.x === "number" &&
      typeof ev.to.y === "number"
    ) {
      socket.broadcast.emit("draw", ev);
    }
  });

  // Save snapshot
  socket.on("saveSnapshot", (data) => {
    if (data && data.snapshot) snapshots.latest = data.snapshot;
  });

  // Undo/redo restore
  socket.on("requestSnapshot", ({ index }) => {
    if (snapshots[index]) {
      socket.emit("setSnapshot", { snapshot: snapshots[index] });
    }
  });

  // Cursor share
  socket.on("cursor", (p) => {
    io.emit("cursor", {
      id: socket.id,
      x: p.x,
      y: p.y,
      color
    });
  });

  socket.on("clear", () => {
    // broadcast clear to every client
    io.emit("clear");
  });
});

server.listen(3000, () =>
  console.log("Server running → http://localhost:3000")
);

function randomColor() {
  const c = [
    "#E74C3C",
    "#3498DB",
    "#2ECC71",
    "#F39C12",
    "#9B59B6",
    "#1ABC9C",
    "#E67E22",
    "#16A085"
  ];
  return c[Math.floor(Math.random() * c.length)];
}
