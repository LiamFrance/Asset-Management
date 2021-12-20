package com.nashtech.assetmanagementwebservice.service.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nashtech.assetmanagementwebservice.domain.Asset;
import com.nashtech.assetmanagementwebservice.domain.Assignment;
import com.nashtech.assetmanagementwebservice.domain.Category;
import com.nashtech.assetmanagementwebservice.domain.Report;
import com.nashtech.assetmanagementwebservice.domain.Return;
import com.nashtech.assetmanagementwebservice.dto.AssetDTO;
import com.nashtech.assetmanagementwebservice.dto.ReportDTO;
import com.nashtech.assetmanagementwebservice.repository.AssetRepository;
import com.nashtech.assetmanagementwebservice.repository.AssignmentRepository;
import com.nashtech.assetmanagementwebservice.repository.CategoryRepository;
import com.nashtech.assetmanagementwebservice.repository.ReturnRepository;
import com.nashtech.assetmanagementwebservice.service.AssetService;

@Service
public class AssetServiceImpl implements AssetService {

	AssetRepository assetRepository;
	CategoryRepository categoryRepository;
	AssignmentRepository assignmentRepository;
	ReturnRepository returnRepository;

	@Autowired
	public AssetServiceImpl(AssetRepository assetRepository, CategoryRepository categoryRepository,
			AssignmentRepository assignmentRepository, ReturnRepository returnRepository) {
		this.assetRepository = assetRepository;
		this.categoryRepository = categoryRepository;
		this.assignmentRepository = assignmentRepository;
		this.returnRepository = returnRepository;
	}

	@Override
	public List<Asset> getAllAssets() {
		return assetRepository.findAll();
	}

	@Override
	public Optional<Asset> getAssetById(String assetCode) {
		return assetRepository.findById(assetCode);
	}

	public String generateAssetCode(String prefix) {
		int num = 0;
		String id = assetRepository.findLastestAssetCode(prefix + "0");
		if (id != null) {
			num = Integer.valueOf(id.substring(prefix.length())) + 1;
		}
		String serial = String.format("%6s", String.valueOf(num)).replace(" ", "0");
		return prefix + serial;
	}

//	public LocalDate stringToLocalDate(String string) {
//		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//		return LocalDate.parse(string, dtf);
//	}

	@Override
	public Asset convertToAsset(AssetDTO assetDTO) {
		Asset asset = new Asset();
		System.out.println(assetDTO);
		if (assetDTO.getAssetCode() == null) {
			System.out.println(categoryRepository.findByName(assetDTO.getCategory()).getPrefix());
			asset.setAssetCode(generateAssetCode(categoryRepository.findByName(assetDTO.getCategory()).getPrefix()));
		} else {
			asset.setAssetCode(assetDTO.getAssetCode());
		}
		asset.setAssetName(assetDTO.getAssetName());
		asset.setSpecification(assetDTO.getSpecification());
		asset.setInstalledDate(assetDTO.getInstalledDate());
		asset.setState(assetDTO.getState());
		asset.setLocation(assetDTO.getLocation());
		asset.setCategory(categoryRepository.findByName(assetDTO.getCategory()));
		List<Long> assignmentId = new ArrayList<Long>(assetDTO.getAssignments().keySet());
		asset.setAssignments(
				assignmentId.stream().map(id -> assignmentRepository.getById(id)).collect(Collectors.toList()));
		return asset;
	}

	@Override
	public AssetDTO convertToAssetDTO(Asset asset) {
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

	@Override
	public Asset createAsset(AssetDTO assetDTO) {
		return assetRepository.save(convertToAsset(assetDTO));
	}

	@Override
	public Asset updateAsset(AssetDTO assetDTO) {
		if (assetDTO.getState().equals("Recycled")) {
			List<Assignment> assignments = assignmentRepository.findByAssetCode(assetDTO.getAssetCode());
			List<Return> returns = new ArrayList<>();
			assignments.stream().forEach(a -> returns.addAll(a.getReturns()));
			returnRepository.deleteAll(returns);
			assignmentRepository.deleteAll(assignments);
		}
		return assetRepository.save(convertToAsset(assetDTO));
	}

	public Asset updateState(String assetCode, String state) {
		Asset record = assetRepository.findById(assetCode).orElse(null);
		record.setState(state);
		return assetRepository.save(record);
	}

	@Override
	public void deleteAsset(String assetCode) {
		assetRepository.deleteById(assetCode);

	}

	@Override
	public List<Asset> getAssetsByLocation(String location) {
		return assetRepository.findByLocation(location);
	}

	@Override
	public List<ReportDTO> getAllReports(String location) {
		List<Report> cateDetail = assetRepository.getAllReports(location);
		List<Category> listCategories = categoryRepository.findAll();
		Map<String, ReportDTO> result = listCategories.stream().map(category -> new ReportDTO(category.getName()))
				.collect(Collectors.toMap(ReportDTO::getCategory, Function.identity()));
		Iterator<Report> iterator = cateDetail.iterator();
		while (iterator.hasNext()) {
			Report elem = iterator.next();
			ReportDTO obj = result.get(elem.getCategory());
			switch (elem.getState()) {
			case "Available":
				obj.setAvailable(elem.getTotal());
				break;
			case "Not available":
				obj.setNotAvailable(elem.getTotal());
				break;
			case "Assigned":
				obj.setAssigned(elem.getTotal());
				break;
			case "Waiting for recycling":
				obj.setWaitingForRecycling(elem.getTotal());
				break;
			case "Recycled":
				obj.setRecycled(elem.getTotal());
				break;
			default:
				break;
			}

		}
		return new ArrayList<ReportDTO>(result.values());

	}
}
