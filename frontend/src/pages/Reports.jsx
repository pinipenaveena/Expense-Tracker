
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

function Reports() {

    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {

        try {

            const response =
                await API.get("/transactions");

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setTransactions(data);

            // Select the latest transaction month by default
            if (data.length > 0) {

                const dates = data
                    .filter((transaction) => transaction.date)
                    .map((transaction) => transaction.date)
                    .sort();

                if (dates.length > 0) {
                    setSelectedMonth(
                        dates[dates.length - 1].substring(0, 7)
                    );
                }
            }

        } catch (error) {

            console.log("Reports error:", error);

            setError("Unable to load report data");

        } finally {

            setLoading(false);
        }
    };


    // All available months
    const availableMonths = useMemo(() => {

        const months = new Set();

        transactions.forEach((transaction) => {

            if (transaction.date) {
                months.add(
                    transaction.date.substring(0, 7)
                );
            }

        });

        return Array.from(months).sort().reverse();

    }, [transactions]);


    // Transactions for selected month
    const monthlyTransactions = useMemo(() => {

        if (!selectedMonth) {
            return transactions;
        }

        return transactions.filter(
            (transaction) =>
                transaction.date &&
                transaction.date.startsWith(selectedMonth)
        );

    }, [transactions, selectedMonth]);


    // Summary
    const summary = useMemo(() => {

        let income = 0;
        let expense = 0;

        monthlyTransactions.forEach((transaction) => {

            const amount =
                Number(transaction.amount) || 0;

            const type =
                transaction.type
                    ? transaction.type.toUpperCase()
                    : "";

            if (type === "INCOME") {
                income += amount;
            }

            if (type === "EXPENSE") {
                expense += amount;
            }

        });

        return {
            income: income,
            expense: expense,
            balance: income - expense,
            count: monthlyTransactions.length
        };

    }, [monthlyTransactions]);


    // Category totals
    const categoryData = useMemo(() => {

        const categoryTotals = {};

        monthlyTransactions.forEach((transaction) => {

            if (
                transaction.type &&
                transaction.type.toUpperCase() === "EXPENSE"
            ) {

                const category =
                    transaction.category || "Other";

                const amount =
                    Number(transaction.amount) || 0;

                categoryTotals[category] =
                    (categoryTotals[category] || 0) + amount;
            }

        });

        return Object.entries(categoryTotals)
            .map(([name, value]) => ({
                name: name,
                value: value
            }))
            .sort((a, b) => b.value - a.value);

    }, [monthlyTransactions]);


    // Income vs Expense
    const incomeExpenseData = [
        {
            name: "Income",
            amount: summary.income
        },
        {
            name: "Expense",
            amount: summary.expense
        }
    ];


    // Month display
    const formatMonth = (month) => {

        if (!month) {
            return "All Months";
        }

        const date = new Date(
            month + "-01T00:00:00"
        );

        return date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );
    };


    if (loading) {

        return (
            <div className="reports-page">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    Back to Dashboard
                </button>

                <div className="report-message">
                    Loading reports...
                </div>

            </div>
        );
    }


    return (
        <div className="reports-page">

            {/* Header */}

            <div className="report-header">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    Back to Dashboard
                </button>

                <h1>
                    Financial Reports
                </h1>

                <p>
                    Analyze your income and expenses
                </p>

            </div>


            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}


            {/* Month selector */}

            <div className="month-selector-box">

                <label>
                    Select Month
                </label>

                <select
                    value={selectedMonth}
                    onChange={(e) =>
                        setSelectedMonth(
                            e.target.value
                        )
                    }
                >

                    {availableMonths.length === 0 ? (

                        <option value="">
                            No months available
                        </option>

                    ) : (

                        availableMonths.map(
                            (month) => (

                                <option
                                    key={month}
                                    value={month}
                                >
                                    {formatMonth(month)}
                                </option>

                            )
                        )

                    )}

                </select>

            </div>


            {/* Selected month */}

            <div className="selected-month">

                Report for:{" "}

                <strong>
                    {formatMonth(selectedMonth)}
                </strong>

            </div>


            {/* Summary */}

            <div className="report-summary">

                <div className="report-card">

                    <h3>
                        Total Income
                    </h3>

                    <p>
                        ₹{summary.income.toFixed(2)}
                    </p>

                </div>


                <div className="report-card">

                    <h3>
                        Total Expense
                    </h3>

                    <p>
                        ₹{summary.expense.toFixed(2)}
                    </p>

                </div>


                <div className="report-card">

                    <h3>
                        Balance
                    </h3>

                    <p>
                        ₹{summary.balance.toFixed(2)}
                    </p>

                </div>


                <div className="report-card">

                    <h3>
                        Transactions
                    </h3>

                    <p>
                        {summary.count}
                    </p>

                </div>

            </div>


            {/* Income vs Expense */}

            <div className="report-section">

                <h2>
                    Income vs Expense
                </h2>

                {summary.income === 0 &&
                summary.expense === 0 ? (

                    <p className="empty-report">
                        No data available for this month.
                    </p>

                ) : (

                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >

                            <BarChart
                                data={incomeExpenseData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="name"
                                />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="amount"
                                    fill="#667eea"
                                    name="Amount"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                )}

            </div>


            {/* Category breakdown */}

            <div className="report-section">

                <h2>
                    Expense by Category
                </h2>

                {categoryData.length === 0 ? (

                    <p className="empty-report">
                        No expense data available for this month.
                    </p>

                ) : (

                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >

                            <PieChart>

                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    label
                                >

                                    {categoryData.map(
                                        (entry, index) => (

                                            <Cell
                                                key={
                                                    "category-" +
                                                    index
                                                }
                                                fill={
                                                    [
                                                        "#667eea",
                                                        "#764ba2",
                                                        "#2e8b57",
                                                        "#e67e22",
                                                        "#c0392b",
                                                        "#16a085",
                                                        "#8e44ad",
                                                        "#34495e"
                                                    ][
                                                        index % 8
                                                    ]
                                                }
                                            />

                                        )
                                    )}

                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                )}

            </div>


            {/* Selected month transactions */}

            <div className="report-section">

                <h2>
                    Transactions for {formatMonth(selectedMonth)}
                </h2>

                {monthlyTransactions.length === 0 ? (

                    <p className="empty-report">
                        No transactions for this month.
                    </p>

                ) : (

                    <div className="report-transaction-list">

                        {monthlyTransactions.map(
                            (transaction) => (

                                <div
                                    className="report-transaction"
                                    key={transaction.id}
                                >

                                    <div>

                                        <h3>
                                            {transaction.title}
                                        </h3>

                                        <p>
                                            {transaction.category}
                                            {" | "}
                                            {transaction.date}
                                        </p>

                                    </div>

                                    <strong
                                        className={
                                            transaction.type ===
                                            "INCOME"
                                                ? "income-amount"
                                                : "expense-amount"
                                        }
                                    >
                                        {transaction.type ===
                                        "INCOME"
                                            ? "+"
                                            : "-"}
                                        ₹
                                        {Number(
                                            transaction.amount
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Reports;
