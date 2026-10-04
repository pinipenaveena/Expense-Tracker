package com.expense.tracker.dto;

import com.expense.tracker.entity.Transaction;

public class TransactionResponse {

    private Long id;
    private String title;
    private Double amount;
    private String type;
    private String category;
    private String description;
    private String date;

    public TransactionResponse(Transaction transaction) {

        this.id = transaction.getId();
        this.title = transaction.getTitle();
        this.amount = transaction.getAmount();
        this.type = transaction.getType();
        this.category = transaction.getCategory();
        this.description = transaction.getDescription();

        if (transaction.getDate() != null) {
            this.date = transaction.getDate().toString();
        }
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Double getAmount() {
        return amount;
    }

    public String getType() {
        return type;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public String getDate() {
        return date;
    }
}