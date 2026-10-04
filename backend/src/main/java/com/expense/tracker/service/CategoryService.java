
package com.expense.tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.expense.tracker.entity.Category;
import com.expense.tracker.entity.User;
import com.expense.tracker.repository.CategoryRepository;
import com.expense.tracker.repository.UserRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            UserRepository userRepository) {

        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    // Get categories for logged-in user
    public List<Category> getMyCategories(
            String username) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return categoryRepository.findByUser(user);
    }

    // Add category
    public Category addCategory(
            String name,
            String username) {

        if (name == null ||
                name.trim().isEmpty()) {

            throw new RuntimeException(
                    "Category name is required");
        }

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String categoryName =
                name.trim();

        if (categoryRepository
                .existsByNameAndUser(
                        categoryName,
                        user)) {

            throw new RuntimeException(
                    "Category already exists");
        }

        Category category =
                new Category();

        category.setName(categoryName);
        category.setUser(user);

        return categoryRepository.save(category);
    }

    // Delete category
    public void deleteCategory(
            Long id,
            String username) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Category category =
                categoryRepository
                        .findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Category not found"));

        categoryRepository.delete(category);
    }
}
