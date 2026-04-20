import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Message {
    username: string;
    message: string;
}

interface User {
    username: string;
}

interface ChatState {
    messages: Message[];
    users: User[];
    connected: boolean;
}

const initialState: ChatState = {
    messages: [],
    users: [],
    connected: false
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setConnected(state, action: PayloadAction<boolean>) {
            state.connected = action.payload;
        },
        setMessages(state, action: PayloadAction<Message[]>) {
            state.messages = action.payload;
        },
        addMessage(state, action: PayloadAction<Message>) {
            state.messages.push(action.payload);
        },
        setUsers(state, action: PayloadAction<User[]>) {
            state.users = action.payload;
        },
        sendMessage(_state, _action: PayloadAction<string>) {

        }
    }
});

export const { setConnected, setMessages, addMessage, setUsers, sendMessage } = chatSlice.actions;
export default chatSlice.reducer;