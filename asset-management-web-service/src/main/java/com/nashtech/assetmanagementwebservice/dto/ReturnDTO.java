package com.nashtech.assetmanagementwebservice.dto;

import java.time.LocalDate;

public class ReturnDTO {
	private Long id;
	private AssignmentDTO assignment;
	private String requestedBy;
	private String acceptedBy;
	private LocalDate returnedDate;
	private String state = "Waiting for returning";

	public ReturnDTO() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRequestedBy() {
		return requestedBy;
	}

	public void setRequestedBy(String requestedBy) {
		this.requestedBy = requestedBy;
	}

	public String getAcceptedBy() {
		return acceptedBy;
	}

	public void setAcceptedBy(String acceptedBy) {
		this.acceptedBy = acceptedBy;
	}

	public LocalDate getReturnedDate() {
		return returnedDate;
	}

	public void setReturnedDate(LocalDate returnedDate) {
		this.returnedDate = returnedDate;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public AssignmentDTO getAssignment() {
		return assignment;
	}

	public void setAssignment(AssignmentDTO assignment) {
		this.assignment = assignment;
	}

	@Override
	public String toString() {
		return "ReturnDTO [id=" + id + ", assignment=" + assignment + ", requestedBy=" + requestedBy + ", acceptedBy="
				+ acceptedBy + ", returnedDate=" + returnedDate + ", state=" + state + "]";
	}

}
