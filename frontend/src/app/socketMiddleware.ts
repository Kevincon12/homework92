import type { Middleware } from '@reduxjs/toolkit';
import { addMessage, setConnected, setMessages, setUsers } from '../features/chat/chatSlice';

export const socketMiddleware: Middleware = (store) => {
    let socket: WebSocket | null = null;
    let reconnectTimer: number | null = null;

    const connect = (token: string) => {
        socket = new WebSocket('ws://localhost:8000');

        socket.onopen = () => {
            console.log('WS Connected');
            store.dispatch(setConnected(true));
            socket?.send(JSON.stringify({ type: 'auth', payload: token }));

            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
                reconnectTimer = null;
            }
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'auth_success':
                    store.dispatch(setMessages(data.payload.messages));
                    break;
                case 'users':
                    store.dispatch(setUsers(data.payload));
                    break;
                case 'new_message':
                    store.dispatch(addMessage(data.payload));
                    break;
            }
        };

        socket.onclose = () => {
            store.dispatch(setConnected(false));
            console.log('WS Closed. Reconnecting in 3s...');

            reconnectTimer = window.setTimeout(() => {
                const state = store.getState() as any;
                if (state.auth.token) {
                    connect(state.auth.token);
                }
            }, 3000);
        };
    };

    return (next) => (action: any) => {
        if (action.type === 'auth/setUser') {
            connect(action.payload.token);
        }

        if (action.type === 'auth/logout') {
            socket?.close();
            socket = null;
        }

        if (action.type === 'chat/sendMessage' && socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'message', payload: action.payload }));
        }

        return next(action);
    };
};