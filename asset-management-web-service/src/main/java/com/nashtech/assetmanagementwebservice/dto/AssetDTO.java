package com.nashtech.assetmanagementwebservice.dto;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class AssetDTO {
	private String assetCode;
	private String assetName;
	private String specification;
	private LocalDate installedDate;
	private String state;
	private String location;
	private String category;

	private Map<Long, String> assignments = new HashMap<Long, String>();

	public Map<Long, String> getAssignments() {
		return assignments;
	}

	public void setAssignments(Map<Long, String> assignments) {
		this.assignments = assignments;
	}

	public String getAssetCode() {
		return assetCode;
	}

	public void setAssetCode(String assetCode) {
		this.assetCode = assetCode;
	}

	public String getAssetName() {
		return assetName;
	}

	public void setAssetName(String assetName) {
		this.assetName = assetName;
	}

	public String getSpecification() {
		return specification;
	}

	public void setSpecification(String specification) {
		this.specification = specification;
	}

	public LocalDate getInstalledDate() {
		return installedDate;
	}

	public void setInstalledDate(LocalDate installedDate) {
		this.installedDate = installedDate;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public AssetDTO() {
	}

	@Override
	public String toString() {
		return "AssetDTO [assetCode=" + assetCode + ", assetName=" + assetName + ", specification=" + specification
				+ ", installedDate=" + installedDate + ", state=" + state + ", location=" + location + ", category="
				+ category + ", assignments=" + assignments + "]";
	}

}
