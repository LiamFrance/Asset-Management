package com.nashtech.assetmanagementwebservice.dto;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class AssignmentDTO {
	private Long id;
	private LocalDate assignedDate;
	private String text;
	private String assignedBy;
	private String state = "Waiting for acceptance";
	private String assignedTo;
	private AssetDTO asset;
	private Map<Long, String> returns = new HashMap<Long, String>();

	public Map<Long, String> getReturns() {
		return returns;
	}

	public void setReturns(Map<Long, String> returns) {
		this.returns = returns;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDate getAssignedDate() {
		return assignedDate;
	}

	public void setAssignedDate(LocalDate assignedDate) {
		this.assignedDate = assignedDate;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getAssignedBy() {
		return assignedBy;
	}

	public void setAssignedBy(String assignedBy) {
		this.assignedBy = assignedBy;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getAssignedTo() {
		return assignedTo;
	}

	public void setAssignedTo(String assignedTo) {
		this.assignedTo = assignedTo;
	}

	public AssetDTO getAsset() {
		return asset;
	}

	public void setAsset(AssetDTO asset) {
		this.asset = asset;
	}

	public AssignmentDTO() {
	}

	@Override
	public String toString() {
		return "AssignmentDTO [id=" + id + ", assignedDate=" + assignedDate + ", text=" + text + ", assignedBy="
				+ assignedBy + ", state=" + state + ", assignedTo=" + assignedTo + ", asset=" + asset + "]";
	}

}
