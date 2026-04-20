import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

const ChatPage = () => {

    const messages = useSelector((state: RootState) => state.chat.messages);
    const users = useSelector((state: RootState) => state.chat.users);

    const [text, setText] = useState("");

    const sendMessage = () => {

        setText("");
    };

    return (
        <Box sx={{ display: "flex", height: "calc(100vh - 60px)" }}>

            <Paper sx={{ width: 250, p: 2, borderRight: "1px solid #ddd" }}>
                <Typography variant="h6">Online users</Typography>

                {users.map((u, i) => (
                    <Typography key={i}>{u.username}</Typography>
                ))}
            </Paper>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>

                <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
                    {messages.map((m, i) => (
                        <Box key={i} sx={{ mb: 1 }}>
                            <b>{m.username}:</b> {m.message}
                        </Box>
                    ))}
                </Box>

                <Box sx={{ display: "flex", gap: 1, p: 2, borderTop: "1px solid #ddd" }}>
                    <TextField
                        fullWidth
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Type message..."
                    />
                    <Button variant="contained" onClick={sendMessage}>
                        Send
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatPage;