import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {

    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {

        const storedUsername =
            localStorage.getItem("username");

        setUsername(storedUsername);

        loadUser();

    }, []);

    const loadUser = async () => {

        try {

            const response =
                await API.get("/user/me");

            setMessage(response.data);

        } catch (error) {

            console.log(error);

            setMessage("Unable to load user");

        }
    };

    return (
        <div className="dashboard">

            <h1>Expense Tracker</h1>

            <h2>Welcome, {username}</h2>

            <p>{message}</p>

        </div>
    );
}

export default Dashboard;