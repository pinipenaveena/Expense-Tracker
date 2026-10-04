import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await API.post("/auth/login", {
                username,
                password
            });

            console.log(response.data);

            // Save JWT token
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Save username
            localStorage.setItem(
                "username",
                response.data.username
            );

            setMessage("Login successful!");

            // Go to dashboard
            setTimeout(() => {
                navigate("/dashboard");
            }, 500);

        } catch (error) {

            console.log(error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Invalid username or password"
                );
            } else {
                setError("Cannot connect to server");
            }
        }
    };

    return (
        <div className="register-page">

            <div className="register-box">

                <h1>Welcome Back</h1>

                <p className="register-subtitle">
                    Login to your Expense Tracker
                </p>

                <form onSubmit={handleLogin}>

                    <label>Username</label>

                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                </form>
                <p className="switch-text">
    Don't have an account?
</p>

<button
    type="button"
    className="secondary-button"
    onClick={() => navigate("/register")}
>
    Create Account
</button>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

            </div>

        </div>
    );
}

export default Login;