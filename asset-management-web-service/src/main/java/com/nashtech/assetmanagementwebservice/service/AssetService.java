package com.nashtech.assetmanagementwebservice.service;

import java.util.List;
import java.util.Optional;

import com.nashtech.assetmanagementwebservice.domain.Asset;
import com.nashtech.assetmanagementwebservice.dto.AssetDTO;
import com.nashtech.assetmanagementwebservice.dto.ReportDTO;

public interface AssetService {
	List<Asset> getAllAssets();

	Optional<Asset> getAssetById(String assetCode);

	Asset createAsset(AssetDTO assetDTO);

	AssetDTO convertToAssetDTO(Asset asset);

	Asset convertToAsset(AssetDTO assetDTO);

	Asset updateAsset(AssetDTO assetDTO);

	void deleteAsset(String assetCode);

	List<Asset> getAssetsByLocation(String location);

	List<ReportDTO> getAllReports(String string);
}
