import { useState } from "react";
import api from "../../api";
import { useDispatch } from "react-redux";
import { setUser } from "./authSlice";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper
} from "@mui/material";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const submit = async () => {
        if (isLogin) {
            const res = await api.post("/users/login", { username, password });
            dispatch(setUser(res.data));
        } else {
            await api.post("/users/register", { username, password });
            setIsLogin(true);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh"
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
                    <Typography
                        variant="h5"
                        sx={{ mb: 2, textAlign: "center" }}
                    >
                        {isLogin ? "Login" : "Register"}
                    </Typography>

                    <TextField
                        fullWidth
                        label="Username"
                        margin="normal"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={submit}
                    >
                        {isLogin ? "Login" : "Register"}
                    </Button>

                    <Button
                        fullWidth
                        sx={{ mt: 1 }}
                        onClick={() => setIsLogin(prev => !prev)}
                    >
                        Switch to {isLogin ? "Register" : "Login"}
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
};

export default AuthPage;