package com.nashtech.assetmanagementwebservice.domain;

public class Report {
	private Long total;
	private String state;
	private String category;

	public Report() {
	}

	public Report(String category, String state, Long total) {
		super();
		this.total = total;
		this.state = state;
		this.category = category;
	}

	public Long getTotal() {
		return total;
	}

	public void setTotal(Long total) {
		this.total = total;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	@Override
	public String toString() {
		return "Report [total=" + total + ", state=" + state + ", category=" + category + "]";
	}

}
