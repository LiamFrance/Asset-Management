package com.nashtech.assetmanagementwebservice.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nashtech.assetmanagementwebservice.domain.Asset;
import com.nashtech.assetmanagementwebservice.domain.Assignment;
import com.nashtech.assetmanagementwebservice.domain.Return;
import com.nashtech.assetmanagementwebservice.dto.AssignmentDTO;
import com.nashtech.assetmanagementwebservice.dto.ReturnDTO;
import com.nashtech.assetmanagementwebservice.mapper.ReturnMapper;
import com.nashtech.assetmanagementwebservice.repository.AssetRepository;
import com.nashtech.assetmanagementwebservice.repository.AssignmentRepository;
import com.nashtech.assetmanagementwebservice.repository.ReturnRepository;
import com.nashtech.assetmanagementwebservice.service.ReturnService;

@Service
public class ReturnServiceImpl implements ReturnService {
	private final ReturnRepository returnRepository;
	private final AssignmentRepository assignmentRepository;
	private final AssetRepository assetRepository;

	@Autowired
	public ReturnServiceImpl(AssignmentRepository assignmentRepository, AssetRepository assetRepository,
			ReturnRepository returnRepository) {
		this.returnRepository = returnRepository;
		this.assignmentRepository = assignmentRepository;
		this.assetRepository = assetRepository;
	}

	@Override
	public ReturnDTO create(ReturnDTO returnDTO) {
		return ReturnMapper.convertToReturnDTO(returnRepository.save(convertToReturnEntity(returnDTO)));
	}

	@Override
	public ReturnDTO cancel(Return r) {
		returnRepository.deleteById(r.getId());
		return null;
	}

	@Override
	public ReturnDTO complete(Return r) {
		if (r.getState().equals("Waiting for returning")) {
			r.setState("Completed");
			r.setReturnedDate(LocalDate.now());
			Assignment assignment = assignmentRepository.getById(r.getAssignment().getId());
			assignment.setState("Completed");
			assignmentRepository.save(assignment);

			Asset asset = assetRepository.getById(r.getAssignment().getAsset().getAssetCode());
			asset.setState("Available");
			assetRepository.save(asset);

			return ReturnMapper.convertToReturnDTO(returnRepository.save(r));
		}
		return null;
	}

	@Override
	public List<ReturnDTO> searchByAssetCode(String code) {
		return returnRepository.searchByAssetCode(code).stream().map(ReturnMapper::convertToReturnDTO)
				.collect(Collectors.toList());
	}

	@Override
	public List<ReturnDTO> searchByAssetName(String name) {
		return returnRepository.searchByAssetName(name).stream().map(ReturnMapper::convertToReturnDTO)
				.collect(Collectors.toList());
	}

	@Override
	public List<ReturnDTO> searchByRequester(String username) {
		return returnRepository.searchByRequester(username).stream().map(ReturnMapper::convertToReturnDTO)
				.collect(Collectors.toList());
	}

	@Override
	public List<ReturnDTO> getAll(String location) {
		return returnRepository.findAll().stream()
				.filter(r -> r.getAssignment().getAssignedTo().getLocation().equals(location))
				.map(ReturnMapper::convertToReturnDTO).collect(Collectors.toList());
	}

	@Override
	public List<ReturnDTO> filterByState(String state, String location) {
		return returnRepository.findByState(state).stream()
				.filter(r -> r.getAssignment().getAssignedTo().getLocation().equals(location))
				.map(ReturnMapper::convertToReturnDTO).collect(Collectors.toList());
	}

	@Override
	public List<ReturnDTO> filterByReturnedDate(LocalDate returnedDate, String location) {
		return returnRepository.findByReturnedDate(returnedDate).stream()
				.filter(r -> r.getAssignment().getAssignedTo().getLocation().equals(location))
				.map(ReturnMapper::convertToReturnDTO).collect(Collectors.toList());
	}

	@Override
	public Return getById(Long id) {
		return returnRepository.findById(id).orElse(null);
	}

	public Return convertToReturnEntity(ReturnDTO dto) {
		Return obj = new Return();
		obj.setAcceptedBy(dto.getAcceptedBy());
		obj.setReturnedDate(dto.getReturnedDate());
		obj.setState(dto.getState());
		obj.setAssignment(assignmentRepository.getById(dto.getAssignment().getId()));
		return obj;
	}

	@Override
	public List<ReturnDTO> filterByStateAndReturnedDate(String state, LocalDate date, String location) {
		return returnRepository.filterByStateAnReturnedDate(state, date).stream()
				.filter(r -> r.getAssignment().getAssignedTo().getLocation().equals(location))
				.map(ReturnMapper::convertToReturnDTO).collect(Collectors.toList());
	}

	@Override
	public boolean isRequestPending(AssignmentDTO assignment) {
		return returnRepository.findByAssignmentAndState(assignment.getId()) == null;
	}

}
