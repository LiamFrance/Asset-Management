package com.nashtech.assetmanagementwebservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nashtech.assetmanagementwebservice.domain.Assignment;
import com.nashtech.assetmanagementwebservice.domain.User;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

	@Query("SELECT a FROM Assignment a INNER JOIN a.asset WHERE a.asset.assetCode=:code")
	List<Assignment> findByAssetCode(@Param("code") String assetCode);

	List<Assignment> findByAssignedTo(User assignedTo);

	@Query("SELECT a FROM Assignment a WHERE a.asset.assetCode =?1 AND a.asset.state = 'Assigned'")
	Assignment findByAssetCodeAndAssignedState(String assetCode);
}
