// Just use the global `io` directly, no need to import or require
const socket = io("http://localhost:3000"); // Or your server URL

const userId = 'd8f2f54b-889d-4f73-a4fb-cdee18866ae3'; // Replace with real test user ID

socket.on("connect", () => {
  console.log("✅ Connected to backend as", socket.id);
  socket.emit("register", { user_id: userId });
});

socket.on("notification", (notification) => {
  console.log("📨 Notification received:", notification);
  alert("🔔 " + notification.message);
});