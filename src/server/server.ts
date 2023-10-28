import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
declare module "socket.io" {
  interface Socket {
    username: string;
    room: string;
    directMessages: Map<string, string>;
    userID: any;
  }
}
import path from "path";
import { fileURLToPath } from "url";
import { router } from "./routes/api.js";
import { errorHandler } from "./controllers/userControllers.js";
import * as chatServer from "./websockets/events.js"; // import object of exported functions from events, named chatServer
const app = express();
app.use(express.json());
const whitelist = [
  undefined,
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:3001",
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

app.use("/api", router);

app.use(express.static(path.join(__dirname, '../../dist/client')));

/*
  //* this is the catch all route, it will send the index.html file to the client, needs to be a use method, 
  //*   not a get method, this type of catch all route is needed for react router to work.
  //* The use method will catch all requests, the get method will only catch get requests.
*/
app.use("/", (_req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist/client', 'index.html'));
});

app.use((_req, res) => {
  res.status(404).send("Not Found");
});
app.use(errorHandler);


const httpServer = createServer(app); // pass express to the http server
const io = new Server(httpServer, { // pass http server to socket io server
  cors: { origin: "*" },
});
chatServer.init(io); // call init function from events, passing in socket io server, creating a listener for socket io events

const PORT = 3001;
httpServer.listen(PORT, () => // listen on express server, not socket io server
  console.log("listening on http://localhost:3001")
);


export default app;