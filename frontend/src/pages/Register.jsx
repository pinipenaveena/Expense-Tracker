
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await API.post(
                "/auth/register",
                {
                    username: username,
                    email: email,
                    password: password
                }
            );

            console.log(response.data);

            setMessage(
                "Registration successful! You can now login."
            );

            setUsername("");
            setEmail("");
            setPassword("");

        } catch (error) {

            console.log("Registration error:", error);

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Registration failed"
                );

            } else {

                setError(
                    "Cannot connect to server"
                );
            }
        }
    };

    return (
        <div className="register-page">

            <div className="register-box">

                <h1>
                    Create Account
                </h1>

                <p className="register-subtitle">
                    Create your Expense Tracker account
                </p>

                <form onSubmit={handleRegister}>

                    <label>
                        Username
                    </label>

                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        required
                    />

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <label>
                        Password
                    </label>

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
                        Create Account
                    </button>

                </form>

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

                <p className="switch-text">
                    Already have an account?
                </p>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                        navigate("/login")
                    }
                >
                    Login
                </button>

            </div>

        </div>
    );
}

export default Register;