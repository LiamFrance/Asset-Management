package com.nashtech.assetmanagementwebservice.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nashtech.assetmanagementwebservice.domain.Asset;
import com.nashtech.assetmanagementwebservice.domain.Category;
import com.nashtech.assetmanagementwebservice.dto.CategoryDTO;
import com.nashtech.assetmanagementwebservice.repository.AssetRepository;
import com.nashtech.assetmanagementwebservice.repository.CategoryRepository;
import com.nashtech.assetmanagementwebservice.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {

	AssetRepository assetRepository;
	CategoryRepository categoryRepository;

	@Autowired
	public CategoryServiceImpl(CategoryRepository categoryRepository, AssetRepository assetRepository) {
		this.categoryRepository = categoryRepository;
		this.assetRepository = assetRepository;
	}

	@Override
	public List<Category> getAllCategories() {
		return categoryRepository.findAll();
	}

	@Override
	public Category convertToCategory(CategoryDTO categoryDTO) {
		Category category = new Category();
		category.setName(categoryDTO.getName());
		category.setPrefix(categoryDTO.getPrefix());
		category.setAssets(new ArrayList<Asset>());
		return category;
	}

	@Override
	public CategoryDTO convertToCategoryDTO(Category category) {
		CategoryDTO categoryDTO = new CategoryDTO();
		categoryDTO.setName(category.getName());
		categoryDTO.setPrefix(category.getPrefix());
		categoryDTO.setAssets(category.getAssets().stream().map(Asset::getAssetCode).collect(Collectors.toList()));
		return categoryDTO;
	}

	@Override
	public Category createCategory(CategoryDTO categoryDTO) {
		return categoryRepository.save(convertToCategory(categoryDTO));
	}

	@Override
	public void deleteByName(String name) {
		categoryRepository.deleteByName(name);
	}

}
