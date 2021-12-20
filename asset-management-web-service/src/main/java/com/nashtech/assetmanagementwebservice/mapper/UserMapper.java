package com.nashtech.assetmanagementwebservice.mapper;

import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.nashtech.assetmanagementwebservice.domain.User;
import com.nashtech.assetmanagementwebservice.dto.UserDTO;

@Component
public class UserMapper {
	AssignmentMapper assignmentMapper;

	@Autowired
	public UserMapper(AssignmentMapper assignmentMapper) {
		this.assignmentMapper = assignmentMapper;
	}

	public static UserDTO convertToUserDTO(User user) {
		UserDTO userDTO = new UserDTO();
		userDTO.setId(user.getId());
		userDTO.setUsername(user.getUsername());
		userDTO.setFirstName(user.getFirstName());
		userDTO.setLastName(user.getLastName());
		userDTO.setDob(user.getDob());
		userDTO.setJoinedDate(user.getJoinedDate());
		userDTO.setType(user.getType());
		userDTO.setLocation(user.getLocation());
		userDTO.setGender(user.getGender());
		userDTO.setDisable(user.isDisable());
		userDTO.setFirstTime(user.isFirstTime());
		userDTO.setAssignments(Optional.ofNullable(user.getAssignments()).orElseGet(Collections::emptyList).stream()
				.map(AssignmentMapper::convertToAssignmentDTO).collect(Collectors.toList()));

		return userDTO;
	}
}
