# Architecture
- Client: static files served by Express. canvas.js handles drawing. websocket.js handles socket.io events.
- Server: Express serves static files. socket.io forwards draw events between clients and stores snapshots.
- Rooms: minimal room management in server/rooms.js
- State: server/drawing-state.js keeps an array of base64 snapshots for undo/restore.
