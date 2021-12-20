package com.nashtech.assetmanagementwebservice.mapper;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.nashtech.assetmanagementwebservice.domain.Asset;
import com.nashtech.assetmanagementwebservice.domain.Assignment;
import com.nashtech.assetmanagementwebservice.dto.AssetDTO;

@Component
public class AssetMapper {

	public static AssetDTO convertToAssetDTO(Asset asset) {
		AssetDTO assetDTO = new AssetDTO();
		assetDTO.setAssetCode(asset.getAssetCode());
		assetDTO.setAssetName(asset.getAssetName());
		assetDTO.setSpecification(asset.getSpecification());
		assetDTO.setInstalledDate(asset.getInstalledDate());
		assetDTO.setState(asset.getState());
		assetDTO.setLocation(asset.getLocation());
		assetDTO.setCategory(asset.getCategory().getName());
		assetDTO.setAssignments(
				asset.getAssignments().stream().collect(Collectors.toMap(Assignment::getId, Assignment::getState)));
		return assetDTO;
	}
}
