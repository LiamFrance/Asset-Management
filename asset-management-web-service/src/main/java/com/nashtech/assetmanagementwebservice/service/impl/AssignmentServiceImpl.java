package com.nashtech.assetmanagementwebservice.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nashtech.assetmanagementwebservice.domain.Asset;
import com.nashtech.assetmanagementwebservice.domain.Assignment;
import com.nashtech.assetmanagementwebservice.domain.Return;
import com.nashtech.assetmanagementwebservice.dto.AssignmentDTO;
import com.nashtech.assetmanagementwebservice.exception.AssignmentNotFoundException;
import com.nashtech.assetmanagementwebservice.mapper.AssetMapper;
import com.nashtech.assetmanagementwebservice.repository.AssetRepository;
import com.nashtech.assetmanagementwebservice.repository.AssignmentRepository;
import com.nashtech.assetmanagementwebservice.repository.ReturnRepository;
import com.nashtech.assetmanagementwebservice.repository.UserRepository;
import com.nashtech.assetmanagementwebservice.service.AssignmentService;

@Service
public class AssignmentServiceImpl implements AssignmentService {
	public AssignmentRepository assignmentRepository;
	public AssetRepository assetRepository;
	public UserRepository userRepository;
	public ReturnRepository returnRepository;

	@Autowired
	public AssignmentServiceImpl(AssignmentRepository assignmentRepository, AssetRepository assetRepository,
			UserRepository userRepository, ReturnRepository returnRepository) {
		this.assignmentRepository = assignmentRepository;
		this.assetRepository = assetRepository;
		this.userRepository = userRepository;
		this.returnRepository = returnRepository;
	}

	@Override
	public List<Assignment> getAllAssignments() {
		return assignmentRepository.findAll();
	}

	@Override
	public Optional<Assignment> getAssignmentById(Long id) {
		Optional<Assignment> result = assignmentRepository.findById(id);
		if (result.isEmpty()) {
			throw new AssignmentNotFoundException("Can't found the assignment with id: " + id);
		}
		return result;
	}

	@Override
	public Assignment createAssignment(AssignmentDTO assignmentDTO) {
		Asset record = assetRepository.findById(assignmentDTO.getAsset().getAssetCode()).orElse(null);
		Assignment result = assignmentRepository.save(convertToAssignment(assignmentDTO));
		record.setState("Not available");
		assetRepository.save(record);
		return result;
	}

	@Override
	public AssignmentDTO convertToAssignmentDTO(Assignment assignment) {
		AssignmentDTO assignmentDTO = new AssignmentDTO();
		assignmentDTO.setId(assignment.getId());
		assignmentDTO.setAssignedDate(assignment.getAssignedDate());
		assignmentDTO.setAssignedBy(assignment.getAssignedBy());
		assignmentDTO.setAssignedTo(assignment.getAssignedTo().getUsername());
		assignmentDTO.setState(assignment.getState());
		assignmentDTO.setText(assignment.getText());
		assignmentDTO.setAsset(AssetMapper.convertToAssetDTO(assignment.getAsset()));
		assignmentDTO.setReturns(
				assignment.getReturns().stream().collect(Collectors.toMap(Return::getId, Return::getState)));
		return assignmentDTO;
	}

	@Override
	public Assignment convertToAssignment(AssignmentDTO assignmentDTO) {
		Assignment assignment = new Assignment();
		assignment.setId(assignmentDTO.getId());
		assignment.setAsset(assetRepository.getById(assignmentDTO.getAsset().getAssetCode()));
		assignment.setAssignedDate(assignmentDTO.getAssignedDate());
		assignment.setAssignedBy(assignmentDTO.getAssignedBy());
		assignment.setAssignedTo(userRepository.findUserByUsername(assignmentDTO.getAssignedTo()));
		assignment.setState(assignmentDTO.getState());
		assignment.setText(assignmentDTO.getText());
		List<Long> returnId = new ArrayList<Long>(assignmentDTO.getReturns().keySet());
		assignment.setReturns(returnId.stream().map(id -> returnRepository.getById(id)).collect(Collectors.toList()));
		return assignment;
	}

	@Override
	public Assignment updateAssignment(AssignmentDTO assignmentDTO) {
		Assignment record = assignmentRepository.getById(assignmentDTO.getId());
		Asset oldAssetRecord = record.getAsset();
		oldAssetRecord.setState("Available");
		assetRepository.save(oldAssetRecord);
		record.setAsset(assetRepository.getById(assignmentDTO.getAsset().getAssetCode()));
		record.setAssignedBy(assignmentDTO.getAssignedBy());
		record.setAssignedDate(assignmentDTO.getAssignedDate());
		record.setAssignedTo(userRepository.findUserByUsername(assignmentDTO.getAssignedTo()));
		record.setState(assignmentDTO.getState());
		record.setText(assignmentDTO.getText());
		Asset newAssetRecord = assetRepository.findById(assignmentDTO.getAsset().getAssetCode()).orElse(null);
		newAssetRecord.setState("Not available");
		assetRepository.save(newAssetRecord);
		return assignmentRepository.save(record);
	}

	@Override
	public List<Assignment> getAssignmentsByAssignedTo(String assignedTo) {
		return assignmentRepository.findByAssignedTo(userRepository.findById(assignedTo).orElse(null));
	}

	@Override
	public void deleteAssignment(Long id) {
		Assignment record = assignmentRepository.getById(id);
		Asset assetOfRecord = record.getAsset();
		assetOfRecord.setState("Available");
		assetRepository.save(assetOfRecord);
		returnRepository.deleteAll(record.getReturns());
		assignmentRepository.deleteById(id);
	}

	@Override
	public Assignment updateState(String id, String state) {
		Assignment record = assignmentRepository.getById(Long.valueOf(id));
		Asset assetOfRecord = record.getAsset();
		switch (state) {
		case "Deleted":
			assetOfRecord.setState("Available");
			break;

		case "Accepted":
			assetOfRecord.setState("Assigned");
			break;

		case "Declined":
			assetOfRecord.setState("Available");
			break;

		default:
			System.out.println("INVALID STATE");
			break;
		}
		assetRepository.save(assetOfRecord);
		record.setState(state);
		return assignmentRepository.save(record);
	}

	@Override
	public List<Assignment> getAssignmentsByLocation(String location) {
		List<Asset> assetsByLocation = assetRepository.findByLocation(location);
		return getAllAssignments().stream().filter(a -> assetsByLocation.contains(a.getAsset()))
				.collect(Collectors.toList());
	}

}
