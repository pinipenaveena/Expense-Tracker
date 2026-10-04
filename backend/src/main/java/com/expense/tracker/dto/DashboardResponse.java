package com.expense.tracker.dto;

public class DashboardResponse {

    private double totalIncome;
    private double totalExpense;
    private double balance;
    private long totalTransactions;

    public DashboardResponse(
            double totalIncome,
            double totalExpense,
            double balance,
            long totalTransactions) {

        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
        this.totalTransactions = totalTransactions;
    }

    public double getTotalIncome() {
        return totalIncome;
    }

    public double getTotalExpense() {
        return totalExpense;
    }

    public double getBalance() {
        return balance;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }
}