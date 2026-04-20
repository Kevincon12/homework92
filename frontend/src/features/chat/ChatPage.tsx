import { useState, useEffect, useRef } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store";
import { sendMessage } from "./chatSlice";

const ChatPage = () => {
    const dispatch = useDispatch();
    const messages = useSelector((state: RootState) => state.chat.messages);
    const users = useSelector((state: RootState) => state.chat.users);
    const [text, setText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (text.trim()) {
            dispatch(sendMessage(text));
            setText("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <Box sx={{ display: "flex", height: "calc(100vh - 70px)", bgcolor: "#f5f5f5" }}>
            <Paper sx={{ width: 280, p: 2, borderRadius: 0, borderRight: "1px solid #ddd" }}>
                <Typography variant="h6" gutterBottom>
                    Online Users ({users.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                    {users.map((u, i) => (
                        <ListItem key={i} disableGutters>
                            <ListItemText
                                primary={u.username}
                                sx={{ '& .MuiTypography-root': { color: 'primary.main' } }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
                    {messages.map((m, i) => (
                        <Box key={i} sx={{ mb: 2 }}>
                            <Paper sx={{ p: 1.5, display: "inline-block", maxWidth: "80%" }}>
                                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: "bold" }}>
                                    {m.username}
                                </Typography>
                                <Typography variant="body1">{m.message}</Typography>
                            </Paper>
                        </Box>
                    ))}
                    <div ref={messagesEndRef} />
                </Box>

                <Box sx={{ p: 2, bgcolor: "white", borderTop: "1px solid #ddd", display: "flex", gap: 1 }}>
                    <TextField
                        fullWidth
                        size="small"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type message..."
                        autoComplete="off"
                    />
                    <Button variant="contained" onClick={handleSend} sx={{ px: 4 }}>
                        Send
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatPage;