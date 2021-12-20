package com.nashtech.assetmanagementwebservice.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nashtech.assetmanagementwebservice.dto.CategoryDTO;
import com.nashtech.assetmanagementwebservice.service.CategoryService;

@CrossOrigin
@RestController
@RequestMapping("/category")
public class CategoryController {
	CategoryService categoryService;

	@Autowired
	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}

	@GetMapping("")
	public List<CategoryDTO> getAllCategories() {
		return categoryService.getAllCategories().stream()
				.map(category -> categoryService.convertToCategoryDTO(category)).collect(Collectors.toList());
	}

	@PostMapping("")
	public CategoryDTO createCategoryDTO(@RequestBody CategoryDTO categoryDTO) {
		return categoryService.convertToCategoryDTO(categoryService.createCategory(categoryDTO));
	}

	@DeleteMapping("/{name}")
	public void deleteCategory(@PathVariable(name = "name") String name) {
		categoryService.deleteByName(name);
	}
}
