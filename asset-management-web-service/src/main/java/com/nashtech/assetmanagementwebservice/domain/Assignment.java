package com.nashtech.assetmanagementwebservice.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "assignment")
public class Assignment {
	@Id
	@Column(name = "assignment_id")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	@Column
	@NotNull
	private LocalDate assignedDate;
	@Column
	private String text;
	private String assignedBy;
	private String state;
	@ManyToOne
	@JoinColumn(name = "assigned_to")
	private User assignedTo;
	@ManyToOne
	@JoinColumn(name = "asset_code")
	private Asset asset;
	@OneToMany(mappedBy = "assignment")
	private List<Return> returns = new ArrayList<>();

	public Assignment() {
	}

	public Long getId() {
		return id;
	}

	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDate getAssignedDate() {
		return assignedDate;
	}

	public void setAssignedDate(LocalDate assigned_date) {
		this.assignedDate = assigned_date;
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

	public User getAssignedTo() {
		return assignedTo;
	}

	public void setAssignedTo(User assignedTo) {
		this.assignedTo = assignedTo;
	}

	public List<Return> getReturns() {
		return returns;
	}

	public void setReturns(List<Return> returns) {
		this.returns = returns;
	}

	@Override
	public String toString() {
		return "Assignment{" + "id=" + id + ", assignedDate=" + assignedDate + ", text='" + text + '\''
				+ ", assignedBy='" + assignedBy + '\'' + ", state='" + state + '\'' + ", assignedTo=" + assignedTo
				+ ", asset=" + asset + ", returns=" + returns + '}';
	}
}
