package com.nashtech.assetmanagementwebservice.domain;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "category")
public class Category {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	@Max(value = 2)
	private String prefix;
	@NotBlank
	private String name;
	@OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
	private List<Asset> assets;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Asset> getAssets() {
		return assets;
	}

	public void setAssets(List<Asset> assets) {
		this.assets = assets;
	}

	public Category() {

	}

	public Category(String prefix, String name, List<Asset> assets) {
		super();
		this.prefix = prefix;
		this.name = name;
		this.assets = assets;
	}

	public Category(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "Category [id=" + id + ", prefix=" + prefix + ", name=" + name + ", assets=" + assets + "]";
	}

}
