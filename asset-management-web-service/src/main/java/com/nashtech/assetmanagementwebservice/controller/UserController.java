package com.nashtech.assetmanagementwebservice.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nashtech.assetmanagementwebservice.dto.PasswordDTO;
import com.nashtech.assetmanagementwebservice.dto.UserDTO;
import com.nashtech.assetmanagementwebservice.mapper.UserMapper;
import com.nashtech.assetmanagementwebservice.service.UserService;

@CrossOrigin
@RestController
public class UserController {
	private final UserService userService;
	private final PasswordEncoder passwordEncoder;

	@Autowired
	public UserController(UserService userService, PasswordEncoder passwordEncoder) {
		this.userService = userService;
		this.passwordEncoder = passwordEncoder;
	}

	public List<UserDTO> getAllUsers() {
		String location = userService
				.getLocationByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
		return userService.getUserByLocation(location);
	}

	@GetMapping("/users")
	public List<UserDTO> getUsersByLocation(@RequestParam(name = "username", defaultValue = "") String username,
			@RequestParam(name = "type", defaultValue = "") String type) {
		if (!username.equals("")) {
			return getAllUsers().stream().filter(u -> u.getUsername().equals(username)).collect(Collectors.toList());
		}
		if (!type.equals("")) {
			return getAllUsers().stream().filter(u -> type.equals(u.getType())).collect(Collectors.toList());
		}

		return getAllUsers();
	}

	@PostMapping("/users")
	public UserDTO create(@RequestBody @Valid UserDTO userDTO) {
		userDTO.setLocation(
				userService.getLocationByUsername(SecurityContextHolder.getContext().getAuthentication().getName()));
		return userService.create(userDTO);
	}

	@PutMapping("/users")
	public UserDTO update(@RequestBody @Valid UserDTO userDTO) {
		return userService.update(userDTO);
	}

	@DeleteMapping("/users/{id}")
	public UserDTO disable(@PathVariable String id) {
		return userService.disable(id);
	}

	@GetMapping("/users/{id}")
	public UserDTO getUser(@PathVariable String id) {
		return userService.getUserById(id);
	}

	@PostMapping("/users/cpwd")
	public boolean verifyOldPassword(@RequestBody PasswordDTO passwordDTO) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String encodedPsw = userService.getUserByUsername(authentication.getName()).getPassword();
		return passwordEncoder.matches(passwordDTO.getOldPassword(), encodedPsw);
	}

	@PutMapping("/users/cpwd")
	public UserDTO loginFirstTime(@RequestBody PasswordDTO passwordDTO) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return userService.changePwd(authentication.getName(), passwordDTO.getNewPassword());
	}

	@GetMapping("/my-info")
	public UserDTO getIndividualInfo() {
		return UserMapper.convertToUserDTO(
				userService.getUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName()));
	}

}
