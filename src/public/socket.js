// Just use the global `io` directly, no need to import or require
const socket = io("http://localhost:3000"); // Or your server URL

const userId = '7ebcc3f6-d46e-4ec9-a7b4-b7f41e95e22f'; // Replace with real test user ID

socket.on("connect", () => {
  console.log("✅ Connected to backend as", socket.id);
  socket.emit("register", { user_id: userId });
});

socket.on("notification", (notification) => {
  console.log("📨 Notification received:", notification);
  alert("🔔 " + notification.message);
});