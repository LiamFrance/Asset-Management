package com.nashtech.assetmanagementwebservice.service;


import com.nashtech.assetmanagementwebservice.domain.Asset;

import com.nashtech.assetmanagementwebservice.domain.Category;

import com.nashtech.assetmanagementwebservice.dto.CategoryDTO;
import com.nashtech.assetmanagementwebservice.repository.AssetRepository;
import com.nashtech.assetmanagementwebservice.repository.CategoryRepository;
import com.nashtech.assetmanagementwebservice.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceImplTest {
    CategoryRepository categoryRepository = Mockito.mock(CategoryRepository.class);
    AssetRepository assetRepository = Mockito.mock(AssetRepository.class);
    CategoryServiceImpl categoryService = new CategoryServiceImpl(categoryRepository,assetRepository);

    @Test
    @DisplayName("Should Return List When Get All Category")
    void whenGetAll_shouldReturnList() {
        List<Category> mockCategories = new ArrayList<Category>();
        for (int i = 0; i < 10; i++) {
            mockCategories.add(new Category());
        }
        when(categoryRepository.findAll()).thenReturn(mockCategories);

        List<Category> actualCategories = categoryService.getAllCategories();

        assertThat(actualCategories.size()).isEqualTo(mockCategories.size());

        verify(categoryRepository).findAll();
    }


    @Test
    @DisplayName("Should Return Category When Get Category By Name")
    void whenGetByName_shouldReturnCategory() {
        Category mockCategory = new Category();
        Optional<Category> mockCategoryOptional = Optional.of(mockCategory);

        when(categoryRepository.findById(1L)).thenReturn(mockCategoryOptional);

        Optional<Category> actualCategory = categoryRepository.findById(1L);
        assertThat(actualCategory).isEqualTo(mockCategoryOptional);
        verify(categoryRepository).findById(Mockito.anyLong());
    }

    @Test
    @DisplayName("Should Return Category When Create Category")
    void whenCreateCategory_shouldReturnCategory() {

        Category category = new Category();
        List<Asset> assetList = new ArrayList<>();
        assetList.add(new Asset());
        category.setName("Haha");
        category.setPrefix("HH");
        category.setAssets(assetList);
        Random r = new Random();
        long preGeneratedId = r.nextLong();
        category.setId(preGeneratedId);
        when(categoryRepository.save(Mockito.any(Category.class))).thenReturn(category);
        when(assetRepository.findByPrefix(Mockito.any())).thenReturn(assetList);

        CategoryDTO dtoCate = new CategoryDTO();
        Category actualCategory = categoryService.createCategory(dtoCate);
        assertNotNull(actualCategory);
        assertEquals(category,actualCategory);

    }
}