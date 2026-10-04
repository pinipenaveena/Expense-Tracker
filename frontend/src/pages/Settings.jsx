
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Settings() {

    const navigate = useNavigate();

    const username = localStorage.getItem("username");

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    );

    const [categories, setCategories] = useState([]);

    const [categoryName, setCategoryName] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    // Load categories and apply saved theme
    useEffect(() => {

        loadCategories();

        if (localStorage.getItem("darkMode") === "true") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }

    }, []);

    // Get categories
    const loadCategories = async () => {

        try {

            const response =
                await API.get("/categories");

            setCategories(response.data);

        } catch (error) {

            console.log("Category loading error:", error);

            setError("Unable to load categories");
        }
    };

    // Add category
    const handleAddCategory = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!categoryName.trim()) {
            setError("Enter a category name");
            return;
        }

        try {

            const response =
                await API.post("/categories", {
                    name: categoryName.trim()
                });

            setCategories([
                ...categories,
                response.data
            ]);

            setCategoryName("");

            setMessage(
                "Category added successfully"
            );

        } catch (error) {

            console.log("Category add error:", error);

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Unable to add category"
                );

            } else {

                setError(
                    "Cannot connect to server"
                );
            }
        }
    };

    // Delete category
    const handleDeleteCategory = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this category?"
            );

        if (!confirmDelete) {
            return;
        }

        setMessage("");
        setError("");

        try {

            await API.delete(
                "/categories/" + id
            );

            setCategories(
                categories.filter(
                    (category) =>
                        category.id !== id
                )
            );

            setMessage(
                "Category deleted successfully"
            );

        } catch (error) {

            console.log("Category delete error:", error);

            setError(
                "Unable to delete category"
            );
        }
    };

    // Dark mode
    const toggleDarkMode = () => {

        const newMode = !darkMode;

        setDarkMode(newMode);

        localStorage.setItem(
            "darkMode",
            newMode
        );

        if (newMode) {

            document.body.classList.add(
                "dark-mode"
            );

        } else {

            document.body.classList.remove(
                "dark-mode"
            );
        }
    };

    // Logout
    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("username");

        navigate("/login");
    };

    return (
        <div className="settings-page">

            <button
                className="back-button"
                onClick={() => navigate("/dashboard")}
            >
                Back to Dashboard
            </button>


            <div className="settings-box">

                <h1>
                    Settings
                </h1>

                <p className="settings-subtitle">
                    Manage your account and preferences
                </p>


                {/* Account */}

                <div className="settings-item">

                    <div>

                        <h3>
                            Account
                        </h3>

                        <p>
                            Logged in as: {username}
                        </p>

                    </div>

                </div>


                {/* Dark Mode */}

                <div className="settings-item">

                    <div>

                        <h3>
                            Dark Mode
                        </h3>

                        <p>
                            Change the appearance of the application
                        </p>

                    </div>

                    <button
                        className="settings-button"
                        onClick={toggleDarkMode}
                    >
                        {darkMode
                            ? "Turn Off"
                            : "Turn On"}
                    </button>

                </div>


                {/* Categories */}

                <div className="category-section">

                    <h2>
                        Manage Categories
                    </h2>

                    <p className="category-help">
                        Create categories that you use for your expenses.
                    </p>

                    <form
                        className="category-form"
                        onSubmit={handleAddCategory}
                    >

                        <input
                            type="text"
                            placeholder="Example: Gym"
                            value={categoryName}
                            onChange={(e) =>
                                setCategoryName(e.target.value)
                            }
                        />

                        <button
                            type="submit"
                            className="settings-button"
                        >
                            Add Category
                        </button>

                    </form>


                    <div className="category-list">

                        {categories.length === 0 ? (

                            <p>
                                No custom categories yet.
                            </p>

                        ) : (

                            categories.map(
                                (category) => (

                                    <div
                                        className="category-item"
                                        key={category.id}
                                    >

                                        <span>
                                            {category.name}
                                        </span>

                                        <button
                                            className="delete-category-button"
                                            onClick={() =>
                                                handleDeleteCategory(
                                                    category.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>


                {/* Messages */}

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


                {/* Logout */}

                <div className="settings-item">

                    <div>

                        <h3>
                            Logout
                        </h3>

                        <p>
                            Sign out from your account
                        </p>

                    </div>

                    <button
                        className="logout-settings-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Settings;