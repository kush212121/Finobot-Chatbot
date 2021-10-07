import express from "express";
import { Server as socketio } from "socket.io";
import http from "http";
import cors from "cors";

//DESC: init
const app = express();
const server = http.createServer(app);
const io = new socketio(server, {
  cors: {
    origin: "*",
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//DESC: Custom Imports
import sock from "./config/socket.js";
//socket.io logic
sock(io);
import connectDB from "./config/db.js";
//routes
import orgRoute from "./routes/orgRoute.js";
import agentRoute from "./routes/agentRoute.js";

//DESC: Middleware
app.use(cors());
app.use(express.json());
//Route middleware
app.use("/api/org", orgRoute);
app.use("/api/org", agentRoute);

//DESC: Constants
const PORT = process.env.PORT || 5000;

//DESC: MongoDB
connectDB();

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}...`);
});
