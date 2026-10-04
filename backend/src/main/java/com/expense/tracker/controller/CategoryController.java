package com.expense.tracker.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expense.tracker.dto.CategoryResponse;
import com.expense.tracker.entity.Category;
import com.expense.tracker.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(
            CategoryService categoryService) {

        this.categoryService = categoryService;
    }

    // GET MY CATEGORIES
    @GetMapping
    public List<CategoryResponse> getMyCategories(
            Authentication authentication) {

        String username = authentication.getName();

        return categoryService
                .getMyCategories(username)
                .stream()
                .map(CategoryResponse::new)
                .toList();
    }

    // ADD CATEGORY
    @PostMapping
    public CategoryResponse addCategory(
            @RequestBody CategoryRequest request,
            Authentication authentication) {

        String username = authentication.getName();

        Category category =
                categoryService.addCategory(
                        request.getName(),
                        username
                );

        return new CategoryResponse(category);
    }

    // DELETE CATEGORY
    @DeleteMapping("/{id}")
    public String deleteCategory(
            @PathVariable Long id,
            Authentication authentication) {

        String username = authentication.getName();

        categoryService.deleteCategory(
                id,
                username
        );

        return "Category deleted successfully";
    }

    // Request class
    public static class CategoryRequest {

        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}