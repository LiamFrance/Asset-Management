package com.nashtech.assetmanagementwebservice.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nashtech.assetmanagementwebservice.domain.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
	@Query("SELECT c FROM Category c WHERE c.name = :name")
	Category findByName(@Param("name") String name);

	@Transactional
	@Modifying
	@Query("DELETE FROM Category c WHERE c.name=:name")
	void deleteByName(@Param("name") String name);
}
