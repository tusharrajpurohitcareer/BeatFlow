require("dotenv").config();

const express = require("express");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");

const connectDB = require("./config/database");
const logger = require("./utils/logger");

const app = express();
const server = http.createServer(app);

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

require("./config/socket")(io);

app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://127.0.0.1:5500",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use("/uploads", express.static("uploads"));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

require("./routes")(app);

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
