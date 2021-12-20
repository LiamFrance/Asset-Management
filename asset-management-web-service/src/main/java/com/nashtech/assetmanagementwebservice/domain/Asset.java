package com.nashtech.assetmanagementwebservice.domain;

import java.time.LocalDate;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "asset")
public class Asset {
	@Id
	@Column(name = "asset_code")
	private String assetCode;
	@Column(name = "asset_name")
	@NotBlank
	private String assetName;
	@Column(name = "specification", length = 50)
	@Size(min = 0, max = 50, message = "Specification should not longer than 50 characters")
	private String specification;
	@Column(name = "installed_date")
	private LocalDate installedDate;
	@Column(name = "state")
	private String state;
	@Column(name = "location")
	private String location;
	@ManyToOne
	@JoinColumn(name = "category_id")
	private Category category;
	@OneToMany(mappedBy = "asset", fetch = FetchType.LAZY)
	private List<Assignment> assignments;

	public List<Assignment> getAssignments() {
		return assignments;
	}

	public void setAssignments(List<Assignment> assignments) {
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

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public Asset() {
	}

	@Override
	public String toString() {
		return "Asset [assetCode=" + assetCode + ", assetName=" + assetName + ", specification=" + specification
				+ ", installedDate=" + installedDate + ", state=" + state + ", location=" + location + ", category="
				+ category + ", assignments=" + assignments + "]";
	}

}
