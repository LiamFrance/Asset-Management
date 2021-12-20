package com.nashtech.assetmanagementwebservice.service;

import java.util.List;

import com.nashtech.assetmanagementwebservice.domain.User;
import com.nashtech.assetmanagementwebservice.dto.UserDTO;

public interface UserService {

	UserDTO create(UserDTO userDTO);

	UserDTO getUserById(String id);

	List<UserDTO> getUserByLocation(String location);

	UserDTO update(UserDTO userDTO);

	List<UserDTO> getAll();

	UserDTO disable(String id);

	User getUserByUsername(String username);

	public UserDTO changePwd(String username, String newPwd);

	String getLocationByUsername(String username);

}
