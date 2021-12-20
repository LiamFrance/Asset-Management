package com.nashtech.assetmanagementwebservice.service;

import java.util.List;
import java.util.Optional;

import com.nashtech.assetmanagementwebservice.domain.Assignment;
import com.nashtech.assetmanagementwebservice.dto.AssignmentDTO;

public interface AssignmentService {
	List<Assignment> getAllAssignments();

	Optional<Assignment> getAssignmentById(Long id);

	Assignment createAssignment(AssignmentDTO assignmentDTO);

	AssignmentDTO convertToAssignmentDTO(Assignment assignment);

	Assignment convertToAssignment(AssignmentDTO assignmentDTO);

	Assignment updateAssignment(AssignmentDTO assignmentDTO);

	List<Assignment> getAssignmentsByAssignedTo(String AssignedTo);

	void deleteAssignment(Long id);

	Assignment updateState(String id, String state);

	List<Assignment> getAssignmentsByLocation(String location);

}
