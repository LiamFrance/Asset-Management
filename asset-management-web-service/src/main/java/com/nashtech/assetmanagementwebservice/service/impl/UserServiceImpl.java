package com.nashtech.assetmanagementwebservice.service.impl;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nashtech.assetmanagementwebservice.domain.User;
import com.nashtech.assetmanagementwebservice.dto.UserDTO;
import com.nashtech.assetmanagementwebservice.mapper.UserMapper;
import com.nashtech.assetmanagementwebservice.repository.AssignmentRepository;
import com.nashtech.assetmanagementwebservice.repository.UserRepository;
import com.nashtech.assetmanagementwebservice.service.UserService;
import com.nashtech.assetmanagementwebservice.utils.DateUtils;
import com.nashtech.assetmanagementwebservice.utils.StringUtils;

@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final AssignmentRepository assignmentRepository;
	private final PasswordEncoder passwordEncoder;

	@Autowired
	public UserServiceImpl(UserRepository userRepository, AssignmentRepository assignmentRepository,
			PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.assignmentRepository = assignmentRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public UserDTO create(UserDTO userDTO) {
		return UserMapper.convertToUserDTO(userRepository.save(convertToUser(userDTO)));
	}

	@Override
	public List<UserDTO> getAll() {
		return userRepository.findAll().stream().map(UserMapper::convertToUserDTO).collect(Collectors.toList());
	}

	@Override
	public UserDTO getUserById(String id) {
		return UserMapper.convertToUserDTO(
				Objects.requireNonNull(userRepository.findById(id).stream().findFirst().orElse(null)));
	}

	@Override
	public List<UserDTO> getUserByLocation(String location) {
		return userRepository.findByLocation(location).stream().map(UserMapper::convertToUserDTO)
				.collect(Collectors.toList());
	}

	@Override
	public UserDTO update(UserDTO userDTO) {
		User user = userRepository.findById(userDTO.getId()).stream().findFirst().orElse(null);
		user.setDob(userDTO.getDob());
		user.setGender(userDTO.getGender());
		user.setJoinedDate(userDTO.getJoinedDate());
		user.setType(userDTO.getType());
		return UserMapper.convertToUserDTO(userRepository.save(user));
	}

	@Override
	public UserDTO disable(String id) {
		User user = userRepository.findById(id).stream().findFirst().orElse(null);
		user.setDisable(true);
		return UserMapper.convertToUserDTO(userRepository.save(user));
	}

	@Override
	public User getUserByUsername(String username) {
		return userRepository.findUserByUsername(username);
	}

	@Override
	public UserDTO changePwd(String username, String newPwd) {
		User user = userRepository.findUserByUsername(username);
		user.setPassword(passwordEncoder.encode(newPwd));
		user.setFirstTime(false);
		return UserMapper.convertToUserDTO(userRepository.save(user));
	}

	public User convertToUser(UserDTO userDTO) {
		User u = new User();
		u.setId(generateId());
		u.setUsername(getUsernameFromUserDTO(userDTO));
		u.setPassword(passwordEncoder.encode(getPasswordFromUserDTO(userDTO)));
		u.setFirstName(userDTO.getFirstName());
		u.setLastName(userDTO.getLastName());
		u.setDob(userDTO.getDob());
		u.setJoinedDate(userDTO.getJoinedDate());
		u.setGender(userDTO.getGender());
		u.setType(userDTO.getType());
		u.setLocation(userDTO.getLocation());
		u.setDisable(userDTO.isDisable());
		u.setFirstTime(userDTO.isFirstTime());
		u.setAssignments(Optional.ofNullable(userDTO.getAssignments()).orElseGet(Collections::emptyList).stream()
				.map(assignment -> assignmentRepository.getById(assignment.getId())).collect(Collectors.toList()));
		return u;
	}

	public String generateId() {
		String idCurrent = userRepository.getIdUserToGen();
		String idAfterSub = idCurrent.substring(2);
		int convertId = Integer.parseInt(idAfterSub);
		String serial = String.format("%4s", convertId + 1).replace(" ", "0");
		String id = "SD" + serial;
		System.out.println("idCurrent" + idCurrent);
		return id;
	}

	public String generateUsername(String firstName, String lastName) {
		String[] arr = lastName.toLowerCase().split(" ");
		String username = firstName.replaceAll(" ", "");
		for (String word : arr) {
			username += word.charAt(0);
		}

		String generatedUsername = StringUtils.removeAccent(username.toLowerCase()).replaceAll("đ", "d");
		User record = null;
		if (!userRepository.findByUsername(generatedUsername).isEmpty()) {
			record = userRepository.findByUsername(generatedUsername).get(0);
		}
		int lastestRecord = !Objects.isNull(record)
				? Integer.valueOf(record.getUsername().replaceAll(generatedUsername, ""))
				: 0;

		return lastestRecord > 0 ? (generatedUsername + (lastestRecord + 1)) : generatedUsername;
	}

	public String generatePassword(String username, LocalDate dob) {
		return username + "@" + DateUtils.dateToString("ddMMyyyy", dob);
	}

	public String getUsernameFromUserDTO(UserDTO userDTO) {
		return generateUsername(userDTO.getFirstName(), userDTO.getLastName());
	}

	public String getPasswordFromUserDTO(UserDTO userDTO) {
		return generatePassword(getUsernameFromUserDTO(userDTO), userDTO.getDob());
	}

	@Override
	public String getLocationByUsername(String username) {
		return userRepository.findLocationByUsername(username);
	}

}
