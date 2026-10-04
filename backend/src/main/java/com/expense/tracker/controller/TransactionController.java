package com.expense.tracker.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expense.tracker.dto.DashboardResponse;
import com.expense.tracker.dto.TransactionResponse;
import com.expense.tracker.entity.Transaction;
import com.expense.tracker.service.TransactionService;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService) {

        this.transactionService = transactionService;
    }

    @PostMapping
    public TransactionResponse addTransaction(
            @RequestBody Transaction transaction,
            Authentication authentication) {

        String username = authentication.getName();

        Transaction saved =
                transactionService.addTransaction(
                        transaction,
                        username
                );

        return new TransactionResponse(saved);
    }

    @GetMapping
    public List<TransactionResponse> getMyTransactions(
            Authentication authentication) {

        String username = authentication.getName();

        return transactionService
                .getMyTransactions(username)
                .stream()
                .map(TransactionResponse::new)
                .toList();
    }

    @GetMapping("/type/{type}")
    public List<TransactionResponse> getByType(
            @PathVariable String type,
            Authentication authentication) {

        String username = authentication.getName();

        return transactionService
                .getMyTransactionsByType(
                        username,
                        type.toUpperCase()
                )
                .stream()
                .map(TransactionResponse::new)
                .toList();
    }

    @GetMapping("/summary")
    public DashboardResponse getDashboardSummary(
            Authentication authentication) {

        String username = authentication.getName();

        return transactionService
                .getDashboardSummary(username);
    }

    @PutMapping("/{id}")
    public TransactionResponse updateTransaction(
            @PathVariable Long id,
            @RequestBody Transaction transaction,
            Authentication authentication) {

        String username = authentication.getName();

        Transaction updated =
                transactionService.updateTransaction(
                        id,
                        transaction,
                        username
                );

        return new TransactionResponse(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(
            @PathVariable Long id,
            Authentication authentication) {

        String username = authentication.getName();

        transactionService.deleteTransaction(
                id,
                username
        );

        return ResponseEntity.ok(
                "Transaction deleted successfully"
        );
    }
}