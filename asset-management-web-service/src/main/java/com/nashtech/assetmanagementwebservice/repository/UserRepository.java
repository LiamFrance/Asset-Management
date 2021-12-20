package com.nashtech.assetmanagementwebservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.nashtech.assetmanagementwebservice.domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

	@Query("SELECT u FROM User u WHERE u.username LIKE CONCAT(?1,'%') ORDER BY u.username DESC ")
	List<User> findByUsername(String username);

	List<User> findByLocation(String location);

	@Query("SELECT u FROM User u WHERE u.username = ?1")
	User findUserByUsername(String username);

	@Query("SELECT u FROM User u WHERE u.type=?1")
	List<User> findUserByType(String type);

	@Query("SELECT u.location from User u WHERE u.username=?1")
	String findLocationByUsername(String username);

	@Query(nativeQuery = true, value = "SELECT id FROM user ORDER BY id DESC LIMIT 1")
	String getIdUserToGen();
}
