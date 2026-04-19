import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import User from "./models/User";
import Message from "./models/Message";
import usersRouter from "./routes/users";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/chat")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use("/users", usersRouter);

app.get("/", (req, res) => {
    res.send({ message: "API working" });
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const clients = new Map<WebSocket, { id: string; username: string }>();

const broadcastUsers = () => {
    const users = Array.from(clients.values());

    for (const client of clients.keys()) {
        client.send(JSON.stringify({
            type: "users",
            payload: users
        }));
    }
};

wss.on("connection", (ws: WebSocket) => {
    ws.on("message", async (message: Buffer) => {
        const data = JSON.parse(message.toString());

        if (data.type === "auth") {
            try {
                const decoded = jwt.verify(data.payload, "secret_key") as any;

                const user = await User.findById(decoded.id);

                if (!user) {
                    ws.close();
                    return;
                }

                clients.set(ws, {
                    id: user._id.toString(),
                    username: user.username
                });

                const lastMessages = (await Message.find()
                    .sort({ createdAt: -1 })
                    .limit(30))
                    .reverse();

                ws.send(JSON.stringify({
                    type: "auth_success",
                    payload: {
                        username: user.username,
                        messages: lastMessages
                    }
                }));

                broadcastUsers();

            } catch (e) {
                ws.close();
            }
        }

        if (data.type === "message") {
            const user = clients.get(ws);

            if (!user) return;

            const newMessage = {
                username: user.username,
                message: data.payload
            };

            await Message.create(newMessage);

            for (const client of clients.keys()) {
                client.send(JSON.stringify({
                    type: "new_message",
                    payload: newMessage
                }));
            }
        }
    });

    ws.on("close", () => {
        clients.delete(ws);
        broadcastUsers();
    });
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});