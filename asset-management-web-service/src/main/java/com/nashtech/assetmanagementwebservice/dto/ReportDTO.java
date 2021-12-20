package com.nashtech.assetmanagementwebservice.dto;

public class ReportDTO {
	private String category;
	private Long available = 0L;
	private Long notAvailable = 0L;
	private Long recycled = 0L;
	private Long assigned = 0L;
	private Long waitingForRecycling = 0L;

	public ReportDTO() {
	}

	public ReportDTO(String category, Long available, Long notAvailable, Long recycled, Long assigned,
			Long waitingForRecycling) {
		this.category = category;
		this.available = available;
		this.notAvailable = notAvailable;
		this.recycled = recycled;
		this.assigned = assigned;
		this.waitingForRecycling = waitingForRecycling;
	}

	public ReportDTO(String category) {
		this.category = category;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public Long getAvailable() {
		return available;
	}

	public void setAvailable(Long available) {
		this.available = available;
	}

	public Long getNotAvailable() {
		return notAvailable;
	}

	public void setNotAvailable(Long notAvailable) {
		this.notAvailable = notAvailable;
	}

	public Long getRecycled() {
		return recycled;
	}

	public void setRecycled(Long recycled) {
		this.recycled = recycled;
	}

	public Long getAssigned() {
		return assigned;
	}

	public void setAssigned(Long assigned) {
		this.assigned = assigned;
	}

	public Long getWaitingForRecycling() {
		return waitingForRecycling;
	}

	public void setWaitingForRecycling(Long waitingForRecycling) {
		this.waitingForRecycling = waitingForRecycling;
	}

	@Override
	public String toString() {
		return "ReportDTO [category=" + category + ", available=" + available + ", notAvailable=" + notAvailable
				+ ", recycled=" + recycled + ", assigned=" + assigned + ", waitingForRecycling=" + waitingForRecycling
				+ "]";
	}

}
