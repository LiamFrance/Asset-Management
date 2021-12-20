package com.nashtech.assetmanagementwebservice.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.nashtech.assetmanagementwebservice.domain.Return;

@Repository
public interface ReturnRepository extends JpaRepository<Return, Long> {
	List<Return> findByState(String state);

	List<Return> findByReturnedDate(LocalDate returnedDate);

	@Query("SELECT r  FROM Return r WHERE r.assignment.asset.assetCode LIKE %?1%")
	List<Return> searchByAssetCode(String assetCode);

	@Query("SELECT r  FROM Return r WHERE r.assignment.asset.assetName LIKE %?1%")
	List<Return> searchByAssetName(String assetName);

	@Query("SELECT r  FROM Return r WHERE r.assignment.assignedTo.username LIKE %?1%")
	List<Return> searchByRequester(String username);

	@Query("SELECT r  FROM Return r WHERE r.state = ?1 AND r.returnedDate=?2")
	List<Return> filterByStateAnReturnedDate(String state, LocalDate date);

	@Query("SELECT r FROM Return r WHERE r.state='Waiting for returning' AND r.assignment.id=?1")
	Return findByAssignmentAndState(Long id);
}
