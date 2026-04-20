import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./app/store";
import AuthPage from "./features/auth/AuthPage";
import { logout } from "./features/auth/authSlice";

const App = () => {
    const dispatch = useDispatch();

    const token = useSelector((state: RootState) => state.auth.token);
    const username = useSelector((state: RootState) => state.auth.username);

    if (!token) {
        return <AuthPage />;
    }

    return (
        <div>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                borderBottom: "1px solid #ccc"
            }}>
                <div>Chat App</div>
                <div>
                    Welcome, {username}
                    <button onClick={() => dispatch(logout())}>
                        Logout
                    </button>
                </div>
            </div>

            <div>CHAT WILL BE HERE</div>
        </div>
    );
};

export default App;