// Just use the global `io` directly, no need to import or require
const socket = io("http://localhost:3000"); // Or your server URL

const userId = '78607b50-4f34-4226-84bd-cf3f1c8289c0'; // Replace with real test user ID

socket.on("connect", () => {
  console.log("✅ Connected to backend as", socket.id);
  socket.emit("register", { user_id: userId });
});

socket.on("notification", (notification) => {
  console.log("📨 Notification received:", notification);
  alert("🔔 " + notification.message);
});