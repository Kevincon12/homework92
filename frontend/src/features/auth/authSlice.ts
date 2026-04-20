import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    username: string | null;
}

const initialState: AuthState = {
    token: null,
    username: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<{ token: string; username: string }>) {
            state.token = action.payload.token;
            state.username = action.payload.username;
        },
        logout(state) {
            state.token = null;
            state.username = null;
        }
    }
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;