// Wire up UI to canvas and websocket
(function(){
  const COLORS = ['#000000','#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF','#00FFFF','#FFA500'];
  const app = CanvasApp.init();
  const brushSize = document.getElementById('size');
  const colorsEl = document.getElementById('colors');
  const brushBtn = document.getElementById('brushBtn');
  const eraserBtn = document.getElementById('eraserBtn');
  const undoBtn = document.getElementById('undo');
  const redoBtn = document.getElementById('redo');
  const clearBtn = document.getElementById('clear');
  const downloadBtn = document.getElementById('download');

  // populate colors
  COLORS.forEach(c=>{
    const b = document.createElement('button');
    b.style.background = c;
    b.title = c;
    b.addEventListener('click', ()=> {
      app.setBrush({ color: c, tool: 'brush' });
      brushBtn.classList.add('active');
      eraserBtn.classList.remove('active');
    });
    colorsEl.appendChild(b);
  });

  brushBtn.addEventListener('click', ()=>{
    brushBtn.classList.add('active');
    eraserBtn.classList.remove('active');
    app.setBrush({ tool: 'brush' });
  });
  eraserBtn.addEventListener('click', ()=>{
    eraserBtn.classList.add('active');
    brushBtn.classList.remove('active');
    app.setBrush({ tool: 'eraser' });
  });

  brushSize.addEventListener('input', (e)=>{
    app.setBrush({ size: Number(e.target.value) });
  });

  undoBtn.addEventListener('click', ()=>app.undo());
  redoBtn.addEventListener('click', ()=>app.redo());
  clearBtn.addEventListener("click", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // send event to server
    if (window.socket) {
      window.socket.emit("clear");
    }
  });
  downloadBtn.addEventListener('click', ()=>{
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = document.getElementById('canvas').toDataURL();
    link.click();
  });

  // handle server snapshot requests that can restore a canvas
  if (window.socket){
    window.socket.on('setSnapshot', (data)=>{
      if (data && data.snapshot){
        app.setFromServerSnapshot(data.snapshot);
      }
    });
  }
})();
