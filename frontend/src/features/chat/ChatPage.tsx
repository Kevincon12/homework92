import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
    setConnected,
    setMessages,
    addMessage,
    setUsers
} from "./chatSlice";

const ChatPage = () => {
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);

    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000");

        ws.current.onopen = () => {
            dispatch(setConnected(true));

            ws.current?.send(JSON.stringify({
                type: "auth",
                payload: token
            }));
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "auth_success") {
                dispatch(setMessages(data.payload.messages));
            }

            if (data.type === "new_message") {
                dispatch(addMessage(data.payload));
            }

            if (data.type === "users") {
                dispatch(setUsers(data.payload));
            }
        };

        ws.current.onclose = () => {
            dispatch(setConnected(false));
        };

        return () => {
            ws.current?.close();
        };
    }, [dispatch, token]);

    return <div>CHAT UI SOON</div>;
};

export default ChatPage;