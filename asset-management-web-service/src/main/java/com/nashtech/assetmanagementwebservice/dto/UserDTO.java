package com.nashtech.assetmanagementwebservice.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

public class UserDTO {
	private String id;
	private String username;
	private String firstName;
	private String lastName;
	private String gender;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private LocalDate dob;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime joinedDate;
	private String type;
	private String location = "HN";
	private boolean isDisable = false;
	private boolean isFirstTime = true;

	private List<AssignmentDTO> assignments = new ArrayList<AssignmentDTO>();

	public UserDTO() {

	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public LocalDate getDob() {
		return dob;
	}

	public void setDob(LocalDate dob) {
		this.dob = dob;
	}

	public LocalDateTime getJoinedDate() {
		return joinedDate;
	}

	public void setJoinedDate(LocalDateTime joinedDate) {
		this.joinedDate = joinedDate;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public boolean isDisable() {
		return isDisable;
	}

	public void setDisable(boolean disable) {
		isDisable = disable;
	}

	public boolean isFirstTime() {
		return isFirstTime;
	}

	public void setFirstTime(boolean firstTime) {
		isFirstTime = firstTime;
	}

	public List<AssignmentDTO> getAssignments() {
		return assignments;
	}

	public void setAssignments(List<AssignmentDTO> assignments) {
		this.assignments = assignments;
	}
}
