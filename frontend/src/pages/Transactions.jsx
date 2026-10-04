
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Transactions() {

    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("EXPENSE");
    const [category, setCategory] = useState("Food");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("ALL");

    const [editingId, setEditingId] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Load transactions and categories
    useEffect(() => {
        loadTransactions();
        loadCategories();
    }, []);

    // Get all transactions
    const loadTransactions = async () => {

        try {

            const response =
                await API.get("/transactions");

            setTransactions(response.data);

        } catch (error) {

            console.log(
                "Load transactions error:",
                error
            );

            setError(
                "Unable to load transactions"
            );
        }
    };

    // Get custom categories
    const loadCategories = async () => {

        try {

            const response =
                await API.get("/categories");

            setCategories(response.data);

        } catch (error) {

            console.log(
                "Load categories error:",
                error
            );
        }
    };

    // Clear form
    const clearForm = () => {

        setTitle("");
        setAmount("");
        setType("EXPENSE");
        setCategory("Food");
        setDescription("");
        setDate("");
        setEditingId(null);
    };

    // Add or update transaction
    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        const transactionData = {
            title: title,
            amount: Number(amount),
            type: type,
            category: category,
            description: description,
            date: date || null
        };

        try {

            // UPDATE
            if (editingId !== null) {

                const response =
                    await API.put(
                        "/transactions/" + editingId,
                        transactionData
                    );

                setTransactions(
                    transactions.map(
                        (transaction) =>
                            transaction.id === editingId
                                ? response.data
                                : transaction
                    )
                );

                setMessage(
                    "Transaction updated successfully"
                );

            }

            // ADD
            else {

                const response =
                    await API.post(
                        "/transactions",
                        transactionData
                    );

                setTransactions([
                    response.data,
                    ...transactions
                ]);

                setMessage(
                    "Transaction added successfully"
                );
            }

            clearForm();

        } catch (error) {

            console.log(
                "Save transaction error:",
                error
            );

            setError(
                "Unable to save transaction"
            );
        }
    };

    // Edit transaction
    const handleEdit = (transaction) => {

        setEditingId(transaction.id);

        setTitle(transaction.title);

        setAmount(transaction.amount);

        setType(transaction.type);

        setCategory(transaction.category);

        setDescription(
            transaction.description || ""
        );

        setDate(
            transaction.date || ""
        );

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete transaction
    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this transaction?"
            );

        if (!confirmDelete) {
            return;
        }

        setMessage("");
        setError("");

        try {

            await API.delete(
                "/transactions/" + id
            );

            setTransactions(
                transactions.filter(
                    (transaction) =>
                        transaction.id !== id
                )
            );

            setMessage(
                "Transaction deleted successfully"
            );

            if (editingId === id) {
                clearForm();
            }

        } catch (error) {

            console.log(
                "Delete error:",
                error
            );

            setError(
                "Unable to delete transaction"
            );
        }
    };

    // Search and filter
    const filteredTransactions =
        transactions.filter(
            (transaction) => {

                const transactionTitle =
                    transaction.title
                        ? transaction.title.toLowerCase()
                        : "";

                const transactionCategory =
                    transaction.category
                        ? transaction.category.toLowerCase()
                        : "";

                const searchText =
                    search.toLowerCase();

                const matchesSearch =
                    transactionTitle.includes(
                        searchText
                    ) ||
                    transactionCategory.includes(
                        searchText
                    );

                const matchesType =
                    filterType === "ALL" ||
                    transaction.type === filterType;

                return (
                    matchesSearch &&
                    matchesType
                );
            }
        );

    return (
        <div className="transactions-page">

            <button
                className="back-button"
                onClick={() =>
                    navigate("/dashboard")
                }
            >
                Back to Dashboard
            </button>


            {/* Transaction Form */}

            <div className="transaction-form-box">

                <h1>

                    {editingId !== null
                        ? "Edit Transaction"
                        : "Add Transaction"}

                </h1>

                <form onSubmit={handleSubmit}>

                    <label>
                        Title
                    </label>

                    <input
                        type="text"
                        placeholder="Example: Salary"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        required
                    />


                    <label>
                        Amount
                    </label>

                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                        min="0"
                        step="0.01"
                        required
                    />


                    <label>
                        Type
                    </label>

                    <select
                        value={type}
                        onChange={(e) =>
                            setType(e.target.value)
                        }
                    >

                        <option value="EXPENSE">
                            Expense
                        </option>

                        <option value="INCOME">
                            Income
                        </option>

                    </select>


                    <label>
                        Category
                    </label>

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                    >

                        {/* Default categories */}

                        <option value="Food">
                            Food
                        </option>

                        <option value="Salary">
                            Salary
                        </option>

                        <option value="Shopping">
                            Shopping
                        </option>

                        <option value="Travel">
                            Travel
                        </option>

                        <option value="Education">
                            Education
                        </option>

                        <option value="Medical">
                            Medical
                        </option>

                        <option value="Bills">
                            Bills
                        </option>

                        <option value="Entertainment">
                            Entertainment
                        </option>

                        <option value="Other">
                            Other
                        </option>


                        {/* Custom categories */}

                        {categories.map(
                            (customCategory) => (

                                <option
                                    key={
                                        customCategory.id
                                    }
                                    value={
                                        customCategory.name
                                    }
                                >
                                    {customCategory.name}
                                </option>

                            )
                        )}

                    </select>


                    <label>
                        Description
                    </label>

                    <textarea
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                    />


                    <label>
                        Date
                    </label>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                            setDate(e.target.value)
                        }
                    />


                    <button type="submit">

                        {editingId !== null
                            ? "Update Transaction"
                            : "Add Transaction"}

                    </button>


                    {editingId !== null && (

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                                clearForm();
                                setMessage("");
                                setError("");
                            }}
                        >
                            Cancel
                        </button>

                    )}

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

            </div>


            {/* Transaction List */}

            <div className="transaction-list-box">

                <h2>
                    My Transactions
                </h2>


                {/* Search and filter */}

                <div className="transaction-controls">

                    <input
                        type="text"
                        placeholder="Search by title or category..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />


                    <select
                        value={filterType}
                        onChange={(e) =>
                            setFilterType(e.target.value)
                        }
                    >

                        <option value="ALL">
                            All
                        </option>

                        <option value="INCOME">
                            Income
                        </option>

                        <option value="EXPENSE">
                            Expense
                        </option>

                    </select>

                </div>


                <p className="transaction-count">

                    Showing{" "}
                    {filteredTransactions.length}
                    {" "}
                    transaction(s)

                </p>


                {/* Transaction list */}

                {filteredTransactions.length === 0 ? (

                    <p>
                        No matching transactions found.
                    </p>

                ) : (

                    filteredTransactions.map(
                        (transaction) => (

                            <div
                                className="transaction-item"
                                key={transaction.id}
                            >

                                <div>

                                    <h3>
                                        {transaction.title}
                                    </h3>

                                    <p>
                                        Category:{" "}
                                        {transaction.category}
                                    </p>

                                    <p>
                                        Date:{" "}
                                        {transaction.date}
                                    </p>

                                    <p>
                                        Description:{" "}
                                        {transaction.description ||
                                            "No description"}
                                    </p>

                                </div>


                                <div>

                                    <strong>
                                        ₹
                                        {Number(
                                            transaction.amount
                                        ).toFixed(2)}
                                    </strong>

                                    <p>
                                        {transaction.type}
                                    </p>


                                    <button
                                        onClick={() =>
                                            handleEdit(
                                                transaction
                                            )
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                transaction.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        )
                    )

                )}

            </div>

        </div>
    );
}

export default Transactions;