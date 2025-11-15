# **Collaborative Canvas — Real-Time Drawing App**

A real-time, multi-user collaborative drawing application built with **HTML5 Canvas**, **Vanilla JavaScript**, **Node.js**, and **Socket.IO**.
Features include live drawing sync, undo/redo, user-specific clearing, color selection, brush tools, remote cursors, and room support.

This repository contains:

```
client/   → Frontend (HTML, CSS, JavaScript)
server/   → Backend (Node.js + Socket.IO)
```

Fully deployable on **Render**, **Railway**, **DigitalOcean**, **Heroku**, etc.

---

## 🚀 Features

* ✏️ **Real-time drawing** between any number of connected clients
* 🖱️ **Remote cursor sharing**
* 🎨 **Brush & eraser tools**
* 🌈 **Color picker & brush size control**
* ↩️ **Undo & redo** (per-user stroke history)
* 🧹 **Clear only your own strokes** (does NOT delete others' drawings)
* 💾 **Snapshot/restore support**
* 🏠 **Multiple rooms** (optional)
* ⚡ Ultra-low latency using WebSockets

---

# 🛠️ Tech Stack

### **Frontend**

* HTML5 Canvas API
* Vanilla JavaScript
* Socket.IO client
* CSS

### **Backend**

* Node.js
* Express.js
* Socket.IO server
* In-memory operation history

---

# 📂 Project Structure

```
collaborative-canvas/
│
├── client/
│   ├── index.html
│   ├── style.css
│   ├── canvas.js
│   ├── websocket.js
│   └── main.js
│
└── server/
    ├── server.js
    ├── drawing-state.js
    ├── rooms.js
    └── package.json
```

---

# ⚙️ Local Development Setup

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/repo-name.git
cd collaborative-canvas
```

---

## **Backend Setup**

Located in the `server/` folder.

### **2. Install backend dependencies**

```bash
cd server
npm install
```

### **3. Start the backend**

```bash
npm start
```

Backend runs on:

```
http://localhost:3000
```

---

## **Frontend Setup**

The frontend is static and served from the `client/` directory.

### **4. Open frontend**

You can serve it locally using Live Server OR any static file host:

Example using VSCode Live Server:

* Right click **client/index.html**
* Click **“Open with Live Server”**

---

# 🌐 Deployment Guide (Render)

Render is used for hosting both frontend and backend.

---

## **Backend Deployment (Web Service)**

1. Go to [https://render.com](https://render.com)
2. Click **New → Web Service**
3. Connect GitHub repo
4. Set:

| Setting        | Value         |
| -------------- | ------------- |
| Root Directory | `server`      |
| Build Command  | `npm install` |
| Start Command  | `npm start`   |
| Runtime        | Node          |

5. Deploy

Backend URL example:

```
https://flamai.onrender.com/
```

---

## **Frontend Deployment (Static Site)**

1. New → Static Site
2. Connect repo
3. Set:

| Setting           | Value     |
| ----------------- | --------- |
| Root Directory    | `client`  |
| Publish Directory | `client`  |
| Build Command     | *(empty)* |

4. Deploy

Frontend URL example:

```
https://canvas-frontend.onrender.com
```

---

## **Update Frontend to Use Backend URL**

In `client/websocket.js`, replace:

```js
const socket = io();
```

with:

```js
const socket = io("https://<YOUR_BACKEND>.onrender.com");
```

---

# 🧠 Architecture Overview

### **Client Responsibilities**

* Draw lines immediately for responsiveness
* Emit drawing operations to server
* Store local operations (brush strokes)
* Redraw canvas based on operation history
* Handle undo/redo
* Render remote user cursors

### **Server Responsibilities**

* Maintain global list of all drawing operations
* Tag each stroke with userId + opId
* Broadcast new strokes to all clients
* Handle per-user undo/redo
* Handle per-user clear
* Serve latest snapshots

---

# 🧪 Testing

Open 2–3 browser tabs pointing to the frontend URL.
Drawing in any tab should instantly sync across all others.

---

# 🐛 Troubleshooting

### **❌ No drawing appears on other clients**

* Check console for WebSocket errors
* Confirm frontend uses correct backend URL
* Ensure backend service is running

### **❌ 404 for socket.io**

Backend must be accessible at:

```
https://flamai.onrender.com/
```

### **❌ Clear button clears entire canvas**

Backend must emit unique opIds per user
Frontend must only deactivate matching ops

---

# 🤝 Contributing

Pull requests are welcome!
Please open an issue to discuss major changes.

---

# 📜 License

This project is open-source under the **MIT License**.

---
