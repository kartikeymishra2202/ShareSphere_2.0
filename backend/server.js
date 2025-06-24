import app from "./app.js";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import http from "http";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("join", (room) => {
    socket.join(room);
  });
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
