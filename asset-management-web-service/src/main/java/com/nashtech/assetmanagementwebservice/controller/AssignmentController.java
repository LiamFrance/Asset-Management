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

import com.nashtech.assetmanagementwebservice.dto.AssignmentDTO;
import com.nashtech.assetmanagementwebservice.service.AssetService;
import com.nashtech.assetmanagementwebservice.service.AssignmentService;
import com.nashtech.assetmanagementwebservice.service.UserService;
import com.nashtech.assetmanagementwebservice.utils.DateUtils;

@CrossOrigin
@RestController
@RequestMapping("/assignments")
public class AssignmentController {
	AssignmentService assignmentService;
	UserService userService;
	AssetService assetService;

	@Autowired
	public AssignmentController(AssignmentService assignmentService, UserService userService,
			AssetService assetService) {
		this.assignmentService = assignmentService;
		this.userService = userService;
		this.assetService = assetService;

	}

	public List<AssignmentDTO> getAllAssignments() {
		String location = userService
				.getLocationByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

		return assignmentService.getAssignmentsByLocation(location).stream()
				.map(assignment -> assignmentService.convertToAssignmentDTO(assignment)).collect(Collectors.toList());
	}

	@GetMapping("")
	public List<AssignmentDTO> getAssignmentsByProperties(@RequestParam(name = "state", defaultValue = "") String state,
			@RequestParam(name = "assignedTo", defaultValue = "") String assignedTo,
			@RequestParam(name = "assignedDate", defaultValue = "") String assignedDate) {
		if (!state.equals("")) {
			if (!assignedDate.equals("")) {
				return getAllAssignments().stream()
						.filter(a -> state.equals(a.getState())
								&& assignedDate.equals(DateUtils.dateToString("dd/MM/yyyy", a.getAssignedDate())))
						.collect(Collectors.toList());
			}
			if (!assignedTo.equals("")) {
				return getAllAssignments().stream().filter(a -> a.getState().equals(state))
						.filter(a -> a.getAssignedTo().equals(assignedTo)).collect(Collectors.toList());
			}
			return getAllAssignments().stream().filter(a -> a.getState().equals(state)).collect(Collectors.toList());

		}
		if (!assignedTo.equals("")) {
			return getAllAssignments().stream().filter(a -> a.getAssignedTo().equals(assignedTo))
					.collect(Collectors.toList());
		}
		if (!assignedDate.equals("")) {
			return getAllAssignments().stream()
					.filter(a -> assignedDate.equals(DateUtils.dateToString("dd/MM/yyyy", a.getAssignedDate())))
					.collect(Collectors.toList());
		}
		return getAllAssignments();
	}

	@PostMapping("")
	public AssignmentDTO createAssignment(@RequestBody @Valid AssignmentDTO assignmentDTO) {

		return assignmentService.convertToAssignmentDTO(assignmentService.createAssignment(assignmentDTO));
	}

	@PutMapping("")
	public AssignmentDTO updateAssignment(@RequestBody @Valid AssignmentDTO assignmentDTO) {
		String location = userService
				.getLocationByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
		if (assetService.getAssetById(assignmentDTO.getAsset().getAssetCode()).orElse(null).getLocation()
				.equals(location)) {
			return assignmentService.convertToAssignmentDTO(assignmentService.updateAssignment(assignmentDTO));
		}
		return null;
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteAssignment(@PathVariable String id) {
		Long idLong = Long.valueOf(id);
		if (getAllAssignments().stream().map(AssignmentDTO::getId).collect(Collectors.toList()).contains(idLong)) {
			try {
				assignmentService.deleteAssignment(idLong);
			} catch (RuntimeException e) {
				return ResponseEntity.badRequest().body("Can not delete assignment with Id: " + id);
			}
			return ResponseEntity.status(HttpStatus.OK).body("Deleted the assignment with Id " + id + " successfully!");
		}
		return ResponseEntity.badRequest().body("Can not find assignment with Id: " + id);
	}

	@GetMapping("/{id}")
	public AssignmentDTO getAssignmentById(@PathVariable String id) {
		AssignmentDTO result = assignmentService
				.convertToAssignmentDTO(assignmentService.getAssignmentById(Long.valueOf(id)).orElse(null));
		if (getAllAssignments().stream().map(AssignmentDTO::getId).collect(Collectors.toList())
				.contains(result.getId())) {
			return result;
		}
		return null;
	}

	@PutMapping("/{id}")
	public AssignmentDTO updateAssignmentState(@PathVariable String id, @RequestParam String state) {
		return assignmentService.convertToAssignmentDTO(assignmentService.updateState(id, state));
	}

}
