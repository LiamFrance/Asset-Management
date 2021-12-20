package com.nashtech.assetmanagementwebservice.mapper;

import org.springframework.stereotype.Component;

import com.nashtech.assetmanagementwebservice.domain.Return;
import com.nashtech.assetmanagementwebservice.dto.ReturnDTO;

@Component
public class ReturnMapper {
	public static ReturnDTO convertToReturnDTO(Return obj) {
		ReturnDTO returnDTO = new ReturnDTO();
		returnDTO.setId(obj.getId());
		returnDTO.setRequestedBy(obj.getAssignment().getAssignedTo().getUsername());
		returnDTO.setAcceptedBy(obj.getAcceptedBy());
		returnDTO.setReturnedDate(obj.getReturnedDate());
		returnDTO.setAssignment(AssignmentMapper.convertToAssignmentDTO(obj.getAssignment()));
		returnDTO.setState(obj.getState());
		return returnDTO;
	}
}
