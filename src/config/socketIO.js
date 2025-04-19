const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"], // Allow connections from these frontend URLs
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  //each user login we automatocally add his id and socket.id to the map 
  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ID ${socket.id}`);
    });
    //before disconnect we need to remove that user from the userSocketMap
    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });

  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = { initSocket, getIO };
