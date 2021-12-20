package com.nashtech.assetmanagementwebservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nashtech.assetmanagementwebservice.domain.Asset;
import com.nashtech.assetmanagementwebservice.domain.Category;
import com.nashtech.assetmanagementwebservice.domain.Report;
import com.nashtech.assetmanagementwebservice.dto.AssetDTO;
import com.nashtech.assetmanagementwebservice.dto.ReportDTO;
import com.nashtech.assetmanagementwebservice.repository.AssetRepository;
import com.nashtech.assetmanagementwebservice.repository.AssignmentRepository;
import com.nashtech.assetmanagementwebservice.repository.CategoryRepository;
import com.nashtech.assetmanagementwebservice.service.impl.AssetServiceImpl;

@ExtendWith(MockitoExtension.class)
public class AssetServiceImplTest {
	@Mock
	AssetRepository assetRepository;
	@Mock
	CategoryRepository categoryRepository;
	@Mock
	AssignmentRepository assignmentRepository;

	@InjectMocks
	AssetServiceImpl assetService;

	@Test
	void whenGetAll_shouldReturnList() {
		List<Asset> mockAssets = new ArrayList<Asset>();
		for (int i = 0; i < 10; i++) {
			mockAssets.add(new Asset());
		}
		when(assetRepository.findAll()).thenReturn(mockAssets);

		List<Asset> actualAssets = assetService.getAllAssets();

		assertThat(actualAssets.size()).isEqualTo(mockAssets.size());

		verify(assetRepository).findAll();
	}

	@Test
	void whenGetById_shouldReturnAsset() {
		Asset mockAsset = new Asset();
		mockAsset.setAssetCode("TV000001");
		Optional<Asset> mockAssetOptional = Optional.of(mockAsset);

		when(assetRepository.findById("TV000001")).thenReturn(mockAssetOptional);

		Optional<Asset> actualAsset = assetService.getAssetById("TV000001");
		assertThat(actualAsset).isEqualTo(mockAssetOptional);
		verify(assetRepository).findById(Mockito.anyString());
	}

	@Test
	void whenGetByInvalid_shouldThrowAssetNotFoundException() {
		String invalidAssetCode = "TV000001";
		when(assetRepository.findById(Mockito.anyString())).thenReturn(Optional.ofNullable(null));
		assertEquals(Optional.empty(), assetService.getAssetById(invalidAssetCode));
		verify(assetRepository).findById(Mockito.anyString());
	}

	@Test
	void whenCreateAsset_shouldReturnAsset() {
		Asset stubAsset = new Asset();
		Category stubCategory = new Category();
		stubAsset.setCategory(new Category());
		when(assetRepository.save(Mockito.any(Asset.class))).thenReturn(stubAsset);
		lenient().when(categoryRepository.findById(Mockito.anyLong())).thenReturn(Optional.ofNullable(stubCategory));
		AssetDTO dtoValid = new AssetDTO();
		dtoValid.setAssetCode("KT000001");
		Asset actualAsset = assetService.createAsset(dtoValid);
		assertNotNull(actualAsset);
		assertEquals(stubAsset, actualAsset);
	}

	@Test
	void whenGetAllReports_shouldReturnListReportDTO() {
		List<Report> stubReports = new ArrayList<>();
		stubReports.add(new Report("test1", "Assigned", 5L));
		stubReports.add(new Report("test1", "Waiting for recycling", 2L));
		stubReports.add(new Report("test2", "Recyled", 7L));
		stubReports.add(new Report("test2", "Available", 3L));
		stubReports.add(new Report("test3", "Not available", 6L));
		stubReports.add(new Report("test3", "Assigned", 3L));
		List<Category> stubCategories = new ArrayList<>();
		stubCategories.add(new Category("test1"));
		stubCategories.add(new Category("test2"));
		stubCategories.add(new Category("test3"));
		when(assetRepository.getAllReports(Mockito.anyString())).thenReturn(stubReports);
		when(categoryRepository.findAll()).thenReturn(stubCategories);
		List<ReportDTO> actualResult = assetService.getAllReports("HN");
		verify(assetRepository).getAllReports(Mockito.anyString());
		verify(categoryRepository).findAll();
		assertEquals(actualResult.get(0).getAvailable(), 3L);
		assertEquals(actualResult.get(1).getNotAvailable(), 6L);
		assertEquals(actualResult.get(2).getWaitingForRecycling(), 2L);
	}
}