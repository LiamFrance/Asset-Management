package com.nashtech.assetmanagementwebservice.mapper;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nashtech.assetmanagementwebservice.domain.Assignment;
import com.nashtech.assetmanagementwebservice.domain.Return;
import com.nashtech.assetmanagementwebservice.dto.AssignmentDTO;

@Component
public class AssignmentMapper {

	@Autowired
	AssetMapper assetMapper;

	public static AssignmentDTO convertToAssignmentDTO(Assignment assignment) {
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
}
