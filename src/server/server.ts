import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
declare module "socket.io" {
  interface Socket {
    username: string;
    room: string;
  }
}
import path from "path";
import { fileURLToPath } from "url";
import { router } from "./routes/api.js";
import { errorHandler } from "./controllers/userControllers.js";
import { getUsersInRoom } from "./websockets/users.js";
import * as chatServer from "./websockets/events.js";
const app = express();
app.use(express.json());
const whitelist = [
  undefined,
  "http://localhost:8080",
];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin: any, callback: any) => {
    if (whitelist.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
};
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions))
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(express.static(path.resolve(__dirname, "../client")));
app.use("/api", router);
app.use(errorHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});
chatServer.listen(io);

declare module "socket.io" {
  interface Socket {
    username: string;
    room: string;
  }
}

const PORT = 3001;
httpServer.listen(PORT, () =>
  console.log("listening on http://localhost:3001")
);
