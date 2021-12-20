package com.nashtech.assetmanagementwebservice.service;

import java.util.List;

import com.nashtech.assetmanagementwebservice.domain.Category;
import com.nashtech.assetmanagementwebservice.dto.CategoryDTO;

public interface CategoryService {

	List<Category> getAllCategories();

	Category convertToCategory(CategoryDTO categoryDTO);

	CategoryDTO convertToCategoryDTO(Category category);

	Category createCategory(CategoryDTO categoryDTO);

	void deleteByName(String name);

}
