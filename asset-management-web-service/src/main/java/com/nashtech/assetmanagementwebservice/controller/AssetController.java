package com.nashtech.assetmanagementwebservice.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nashtech.assetmanagementwebservice.dto.AssetDTO;
import com.nashtech.assetmanagementwebservice.dto.ReportDTO;
import com.nashtech.assetmanagementwebservice.service.AssetService;
import com.nashtech.assetmanagementwebservice.service.UserService;

@CrossOrigin
@RestController
@RequestMapping("/assets")
public class AssetController {

	AssetService assetService;
	UserService userService;

	@Autowired
	public AssetController(AssetService assetService, UserService userService) {
		this.assetService = assetService;
		this.userService = userService;
	}

	public List<AssetDTO> getAllAssets() {
		String location = userService
				.getLocationByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
		return assetService.getAssetsByLocation(location).stream().map(asset -> assetService.convertToAssetDTO(asset))
				.collect(Collectors.toList());
	}

	@GetMapping("")
	public List<AssetDTO> getAssetsByState(@RequestParam(name = "state", defaultValue = "") String state,
			@RequestParam(name = "category", defaultValue = "") String category) {
		if (!state.equals("")) {
			if (!category.equals("")) {
				return getAllAssets().stream()
						.filter(a -> state.equals(a.getState()) && category.equals(a.getCategory()))
						.collect(Collectors.toList());
			}
			return getAllAssets().stream().filter(a -> a.getState().equals(state)).collect(Collectors.toList());
		}
		if (!category.equals("")) {
			return getAllAssets().stream().filter(a -> category.equals(a.getCategory())).collect(Collectors.toList());
		}
		return getAllAssets();
	}

	@PostMapping("")
	public AssetDTO createAsset(@RequestBody @Valid AssetDTO assetDTO) {
		assetDTO.setLocation(
				userService.getLocationByUsername(SecurityContextHolder.getContext().getAuthentication().getName()));
		return assetService.convertToAssetDTO(assetService.createAsset(assetDTO));
	}

	@PutMapping("")
	public AssetDTO updateAsset(@RequestBody @Valid AssetDTO assetDTO) {
		String location = userService
				.getLocationByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
		if (assetDTO.getLocation().equals(location)) {
			return assetService.convertToAssetDTO(assetService.updateAsset(assetDTO));
		}
		return null;
	}

	@DeleteMapping("/{assetCode}")
	public ResponseEntity<String> deleteAsset(@PathVariable(name = "assetCode") String assetCode) {
		if (getAllAssets().stream().map(AssetDTO::getAssetCode).collect(Collectors.toList()).contains(assetCode)) {
			try {
				assetService.deleteAsset(assetCode);
			} catch (RuntimeException e) {
				return ResponseEntity.badRequest().body("Can not delete asset with Id: " + assetCode);
			}
			return ResponseEntity.status(HttpStatus.OK)
					.body("Deleted the assignment with Id " + assetCode + " successfully!");
		}
		return ResponseEntity.badRequest().body("Can not delete assignment with Id: " + assetCode);
	}

	@GetMapping("/{assetCode}")
	public AssetDTO getAssetById(@PathVariable(name = "assetCode") String assetCode) {
		String location = userService
				.getLocationByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
		AssetDTO record = assetService.convertToAssetDTO(assetService.getAssetById(assetCode).orElse(null));
		return record.getLocation().equals(location) ? record : null;
	}

	@GetMapping("/statistics")
	public List<ReportDTO> getAllReports() {
		return assetService.getAllReports(
				userService.getLocationByUsername(SecurityContextHolder.getContext().getAuthentication().getName()));
	}

}
