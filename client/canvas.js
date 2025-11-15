(function (exports) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let drawing = false;
  let last = null;

  let brush = {
    color: "#000000",
    size: 3,
    tool: "brush"
  };

  const undoStack = [];
  let undoIndex = -1;

  function setBrush(opt) {
    brush = Object.assign(brush, opt);
  }

  function saveState() {
    try {
      const data = canvas.toDataURL();
      if (undoIndex < undoStack.length - 1) undoStack.splice(undoIndex + 1);
      undoStack.push(data);
      undoIndex = undoStack.length - 1;

      if (window.socket && window.socket.connected) {
        window.socket.emit("saveSnapshot", { snapshot: data });
      }
    } catch (e) {}
  }

  function restoreState(dataURL) {
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataURL;
  }

  function undo() {
    if (undoIndex > 0) {
      undoIndex--;
      restoreState(undoStack[undoIndex]);
      if (window.socket)
        window.socket.emit("requestSnapshot", { index: undoIndex });
    }
  }

  function redo() {
    if (undoIndex < undoStack.length - 1) {
      undoIndex++;
      restoreState(undoStack[undoIndex]);
      if (window.socket)
        window.socket.emit("requestSnapshot", { index: undoIndex });
    }
  }

  function startDraw(e) {
    drawing = true;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    last = { x, y };
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e) {
    if (!drawing) return;

    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    ctx.strokeStyle = brush.tool === "eraser" ? "#ffffff" : brush.color;
    ctx.lineWidth = brush.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (window.socket && last) {
      window.socket.emit("draw", {
        from: { x: last.x, y: last.y },
        to: { x, y },
        color: brush.tool === "eraser" ? "#ffffff" : brush.color,
        size: brush.size,
        tool: brush.tool
      });
    }

    last = { x, y };
  }

  function stopDraw() {
    if (!drawing) return;
    drawing = false;
    saveState();
  }

  exports.applyRemote = function (ev) {
    ctx.strokeStyle = ev.tool === "eraser" ? "#ffffff" : ev.color;
    ctx.lineWidth = ev.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(ev.from.x, ev.from.y);
    ctx.lineTo(ev.to.x, ev.to.y);
    ctx.stroke();
  };

  exports.setFromServerSnapshot = function (d) {
    restoreState(d);
    undoStack.length = 0;
    undoStack.push(d);
    undoIndex = 0;
  };

  exports.init = function () {
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseleave", stopDraw);

    saveState();
    return { undo, redo, setBrush };
  };
})(window.CanvasApp || (window.CanvasApp = {}));
