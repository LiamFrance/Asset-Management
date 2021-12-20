package com.nashtech.assetmanagementwebservice.dto;

import java.util.List;

public class CategoryDTO {
	private String name;
	private String prefix;
	private List<String> assets;

	public CategoryDTO() {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public List<String> getAssets() {
		return assets;
	}

	public void setAssets(List<String> assets) {
		this.assets = assets;
	}

	public CategoryDTO(String name, String prefix, List<String> assets) {
		super();
		this.name = name;
		this.prefix = prefix;
		this.assets = assets;
	}

	@Override
	public String toString() {
		return "CategoryDTO [name=" + name + ", prefix=" + prefix + ", assets=" + assets + "]";
	}

}
