(function () {
  const socket = io();
  window.socket = socket;

  const cursors = {};

  const cursorsEl = document.getElementById("cursors");
  const canvas = document.getElementById("canvas");

  socket.on("connect", () => {
    socket.emit("requestLatest");
  });

  socket.on("draw", (ev) => {
    if (window.CanvasApp) window.CanvasApp.applyRemote(ev);
  });

  socket.on("snapshot", (data) => {
    if (data && data.snapshot) {
      window.CanvasApp.setFromServerSnapshot(data.snapshot);
    }
  });

  socket.on("setSnapshot", (data) => {
    if (data && data.snapshot) {
      window.CanvasApp.setFromServerSnapshot(data.snapshot);
    }
  });

  // Cursors
  socket.on("cursor", (p) => {
    let el = cursors[p.id];
    if (!el) {
      el = document.createElement("div");
      el.className = "cursor";
      cursors[p.id] = el;
      cursorsEl.appendChild(el);
    }
    el.style.left = p.x + "px";
    el.style.top = p.y + "px";
    el.style.background = p.color;
  });

  canvas.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    socket.emit("cursor", {
      x: e.clientX - r.left,
      y: e.clientY - r.top
    });
  });
})();

socket.on("clearCanvas", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Optional: also reset undo stack
  if (window.CanvasApp) {
    window.CanvasApp.setFromServerSnapshot(
      canvas.toDataURL()
    );
  }
});

const statusEl = document.getElementById("status");

socket.on("connect", () => {
  statusEl.textContent = "Connected";
  statusEl.style.color = "lime";
});

socket.on("disconnect", () => {
  statusEl.textContent = "Disconnected";
  statusEl.style.color = "red";
});
