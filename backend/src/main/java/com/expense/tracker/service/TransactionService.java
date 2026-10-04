package com.expense.tracker.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.expense.tracker.dto.DashboardResponse;
import com.expense.tracker.entity.Transaction;
import com.expense.tracker.entity.User;
import com.expense.tracker.repository.TransactionRepository;
import com.expense.tracker.repository.UserRepository;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository) {

        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    // ADD TRANSACTION
    public Transaction addTransaction(
            Transaction transaction,
            String username) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        transaction.setUser(user);

        if (transaction.getDate() == null) {
            transaction.setDate(LocalDate.now());
        }

        return transactionRepository.save(transaction);
    }

    // GET ALL TRANSACTIONS FOR CURRENT USER
    public List<Transaction> getMyTransactions(
            String username) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return transactionRepository.findByUser(user);
    }

    // GET EXPENSES OR INCOME
    public List<Transaction> getMyTransactionsByType(
            String username,
            String type) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return transactionRepository
                .findByUserAndType(user, type);
    }

    // DELETE TRANSACTION
    public void deleteTransaction(
            Long id,
            String username) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Transaction transaction = transactionRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found"));



        // Security check
        if (!transaction.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You cannot delete this transaction");
        }

        transactionRepository.delete(transaction);
    }

    public Transaction updateTransaction(
        Long id,
        Transaction updatedTransaction,
        String username) {

    User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    Transaction transaction = transactionRepository
            .findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Transaction not found"));

    // Make sure the transaction belongs to the logged-in user
    if (!transaction.getUser().getId()
            .equals(user.getId())) {

        throw new RuntimeException(
                "You cannot update this transaction");
    }

    transaction.setTitle(updatedTransaction.getTitle());
    transaction.setAmount(updatedTransaction.getAmount());
    transaction.setType(updatedTransaction.getType());
    transaction.setCategory(updatedTransaction.getCategory());
    transaction.setDescription(updatedTransaction.getDescription());
    transaction.setDate(updatedTransaction.getDate());

    return transactionRepository.save(transaction);
}
public DashboardResponse getDashboardSummary(
        String username) {

    User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    List<Transaction> transactions =
            transactionRepository.findByUser(user);

    double totalIncome = 0;
    double totalExpense = 0;

    for (Transaction transaction : transactions) {

        if ("INCOME".equalsIgnoreCase(
                transaction.getType())) {

            totalIncome += transaction.getAmount();

        } else if ("EXPENSE".equalsIgnoreCase(
                transaction.getType())) {

            totalExpense += transaction.getAmount();
        }
    }

    double balance = totalIncome - totalExpense;

    return new DashboardResponse(
            totalIncome,
            totalExpense,
            balance,
            transactions.size()
    );
}
}