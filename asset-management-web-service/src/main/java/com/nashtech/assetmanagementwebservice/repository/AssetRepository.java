package com.nashtech.assetmanagementwebservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.nashtech.assetmanagementwebservice.domain.Asset;
import com.nashtech.assetmanagementwebservice.domain.Report;

@Repository
public interface AssetRepository extends JpaRepository<Asset, String> {
	@Query("SELECT a FROM Asset a WHERE a.assetCode LIKE ?1%")
	List<Asset> findByPrefix(String prefix);

	List<Asset> findByLocation(String location);

	@Query("SELECT a.location FROM Asset a WHERE a.assetCode=?1")
	String findLocationByAssetCode(String location);

	@Query(nativeQuery = true, value = "SELECT asset_code FROM asset WHERE asset_code LIKE ?1% ORDER BY asset_code DESC LIMIT 1 ")
	String findLastestAssetCode(String prefix);

	@Query("SELECT " + " new com.nashtech.assetmanagementwebservice.domain.Report(c.name, a.state ,Count(*))" + " FROM "
			+ " Asset a INNER JOIN a.category c " + "WHERE a.location=?1 GROUP BY a.category,a.state")
	List<Report> getAllReports(String location);
}
