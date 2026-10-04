
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

function Home() {

    const navigate = useNavigate();

    const username =
        localStorage.getItem("username");

    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        totalTransactions: 0
    });

    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // --------------------------------
    // Load dashboard data
    // --------------------------------

    const loadDashboard = useCallback(async () => {

        setLoading(true);
        setError("");

        try {

            const summaryResponse =
                await API.get("/transactions/summary");

            const transactionsResponse =
                await API.get("/transactions");

            console.log(
                "SUMMARY:",
                summaryResponse.data
            );

            console.log(
                "TRANSACTIONS:",
                transactionsResponse.data
            );

            setSummary({
                totalIncome:
                    Number(
                        summaryResponse.data.totalIncome
                    ) || 0,

                totalExpense:
                    Number(
                        summaryResponse.data.totalExpense
                    ) || 0,

                balance:
                    Number(
                        summaryResponse.data.balance
                    ) || 0,

                totalTransactions:
                    Number(
                        summaryResponse.data.totalTransactions
                    ) || 0
            });

            setTransactions(
                Array.isArray(
                    transactionsResponse.data
                )
                    ? transactionsResponse.data
                    : []
            );

        } catch (error) {

            console.log(
                "Dashboard error:",
                error
            );

            setError(
                "Unable to load dashboard data"
            );

        } finally {

            setLoading(false);

        }

    }, []);


    // Load when dashboard opens
    useEffect(() => {

    loadDashboard();

    const handleFocus = () => {
        loadDashboard();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
        window.removeEventListener("focus", handleFocus);
    };

}, [loadDashboard]);
    // --------------------------------
    // Create monthly chart data
    // --------------------------------

    const monthlyDataMap = {};

    transactions.forEach((transaction) => {

        if (!transaction.date) {
            return;
        }

        const date =
            new Date(transaction.date);

        if (isNaN(date.getTime())) {
            return;
        }

        const month =
            date.toLocaleString(
                "en-US",
                {
                    month: "short",
                    year: "numeric"
                }
            );

        if (!monthlyDataMap[month]) {

            monthlyDataMap[month] = {
                month: month,
                income: 0,
                expense: 0
            };

        }

        const amount =
            Number(transaction.amount) || 0;

        const transactionType =
            transaction.type
                ? transaction.type.toUpperCase()
                : "";

        if (
            transactionType === "INCOME"
        ) {

            monthlyDataMap[month].income +=
                amount;

        }

        if (
            transactionType === "EXPENSE"
        ) {

            monthlyDataMap[month].expense +=
                amount;

        }

    });


    const chartData =
        Object.values(monthlyDataMap);


    // --------------------------------
    // Recent transactions
    // --------------------------------

    const recentTransactions =
        [...transactions]
            .sort((a, b) => {

                const dateA =
                    new Date(a.date || 0);

                const dateB =
                    new Date(b.date || 0);

                return dateB - dateA;

            })
            .slice(0, 5);


    // --------------------------------
    // Logout
    // --------------------------------

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem(
            "username"
        );

        navigate("/login");

    };


    return (
        <div className="home-page">

            {/* Sidebar */}

            <aside className="sidebar">

                <h2>
                    Expense Tracker
                </h2>

                <nav>

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() =>
                            navigate("/transactions")
                        }
                    >
                        Transactions
                    </button>

                    <button
                        onClick={() =>
                            navigate("/reports")
                        }
                    >
                        Reports
                    </button>

                    <button
                        onClick={() =>
                            navigate("/settings")
                        }
                    >
                        Settings
                    </button>

                </nav>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </aside>


            {/* Main dashboard */}

            <main className="main-content">

                <div className="top-section">

    <div>

        <h1>
            Dashboard
        </h1>

        <p>
            Welcome, {username}
        </p>

    </div>

    <div className="dashboard-actions">

        <button
            className="add-button"
            onClick={() =>
                navigate("/transactions")
            }
        >
            Add Transaction
        </button>

        <button
            className="view-button"
            onClick={loadDashboard}
        >
            Refresh
        </button>

    </div>

</div>


                {/* Error */}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}


                {/* Summary cards */}

                <div className="summary-container">

                    <div className="summary-card">

                        <h3>
                            Total Income
                        </h3>

                        <p>
                            ₹
                            {summary.totalIncome.toFixed(2)}
                        </p>

                    </div>


                    <div className="summary-card">

                        <h3>
                            Total Expense
                        </h3>

                        <p>
                            ₹
                            {summary.totalExpense.toFixed(2)}
                        </p>

                    </div>


                    <div className="summary-card">

                        <h3>
                            Balance
                        </h3>

                        <p>
                            ₹
                            {summary.balance.toFixed(2)}
                        </p>

                    </div>


                    <div className="summary-card">

                        <h3>
                            Transactions
                        </h3>

                        <p>
                            {summary.totalTransactions}
                        </p>

                    </div>

                </div>


                {/* Monthly chart */}

                <div className="dashboard-section">

                    <h2>
                        Monthly Overview
                    </h2>

                    {loading ? (

                        <div className="chart-placeholder">
                            Loading chart...
                        </div>

                    ) : chartData.length === 0 ? (

                        <div className="chart-placeholder">

                            <p>
                                No transaction data available.
                            </p>

                            <button
                                className="view-button"
                                onClick={() =>
                                    navigate("/transactions")
                                }
                            >
                                Add Transaction
                            </button>

                        </div>

                    ) : (

                        <div className="dashboard-chart">

                            <ResponsiveContainer
                                width="100%"
                                height={350}
                            >

                                <BarChart
                                    data={chartData}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="month"
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Legend />

                                    <Bar
                                        dataKey="income"
                                        fill="#667eea"
                                        name="Income"
                                    />

                                    <Bar
                                        dataKey="expense"
                                        fill="#e67e22"
                                        name="Expense"
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                    )}

                </div>


                {/* Recent transactions */}

                <div className="dashboard-section">

                    <div className="recent-header">

                        <h2>
                            Recent Transactions
                        </h2>

                        <button
                            className="view-button"
                            onClick={() =>
                                navigate("/transactions")
                            }
                        >
                            View All
                        </button>

                    </div>


                    {loading ? (

                        <p>
                            Loading transactions...
                        </p>

                    ) : recentTransactions.length === 0 ? (

                        <p>
                            No transactions found.
                        </p>

                    ) : (

                        <div className="recent-list">

                            {recentTransactions.map(
                                (transaction) => {

                                    const transactionType =
                                        transaction.type
                                            ? transaction.type.toUpperCase()
                                            : "";

                                    return (
                                        <div
                                            className="recent-item"
                                            key={transaction.id}
                                        >

                                            <div>

                                                <h3>
                                                    {
                                                        transaction.title
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        transaction.category
                                                    }
                                                    {" | "}
                                                    {
                                                        transaction.date
                                                    }
                                                </p>

                                            </div>


                                            <div
                                                className={
                                                    transactionType ===
                                                    "INCOME"
                                                        ? "income-amount"
                                                        : "expense-amount"
                                                }
                                            >

                                                {transactionType ===
                                                "INCOME"
                                                    ? "+"
                                                    : "-"}

                                                ₹
                                                {Number(
                                                    transaction.amount
                                                ).toFixed(2)}

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default Home;