package com.nashtech.assetmanagementwebservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nashtech.assetmanagementwebservice.domain.Asset;
import com.nashtech.assetmanagementwebservice.domain.Assignment;
import com.nashtech.assetmanagementwebservice.domain.Category;
import com.nashtech.assetmanagementwebservice.domain.User;
import com.nashtech.assetmanagementwebservice.dto.AssignmentDTO;
import com.nashtech.assetmanagementwebservice.exception.AssignmentNotFoundException;
import com.nashtech.assetmanagementwebservice.repository.AssetRepository;
import com.nashtech.assetmanagementwebservice.repository.AssignmentRepository;
import com.nashtech.assetmanagementwebservice.repository.ReturnRepository;
import com.nashtech.assetmanagementwebservice.repository.UserRepository;
import com.nashtech.assetmanagementwebservice.service.impl.AssignmentServiceImpl;

@ExtendWith(MockitoExtension.class)
public class AssignmentServiceImplTest {
	@Mock
	public AssignmentRepository assignmentRepository;

	@Mock
	public AssetRepository assetRepository;

	@Mock
	public UserRepository userRepository;

	@Mock
	public ReturnRepository returnRepository;

	public AssignmentServiceImpl assignmentService;

	@BeforeEach
	public void init() {
		this.assignmentService = new AssignmentServiceImpl(assignmentRepository, assetRepository, userRepository,
				returnRepository);
	}

	@Test
	void whenGetAll_shouldReturnList() {
		List<Assignment> mockAssignments = new ArrayList<Assignment>();
		for (int i = 0; i < 10; i++) {
			mockAssignments.add(new Assignment());
		}
		when(assignmentRepository.findAll()).thenReturn(mockAssignments);

		List<Assignment> actualAssignments = assignmentService.getAllAssignments();

		assertThat(actualAssignments.size()).isEqualTo(mockAssignments.size());

		verify(assignmentRepository).findAll();
	}

	@Test
	void whenGetById_shouldReturnAssignment() {
		Assignment mockAssignment = new Assignment();
		mockAssignment.setId(1L);
		Optional<Assignment> mockAssignmentOptional = Optional.of(mockAssignment);

		when(assignmentRepository.findById(1L)).thenReturn(mockAssignmentOptional);

		Optional<Assignment> actualAssignment = assignmentService.getAssignmentById(1L);
		assertThat(actualAssignment).isEqualTo(mockAssignmentOptional);
		verify(assignmentRepository).findById(Mockito.anyLong());
	}

	@Test
	void whenGetByInvalid_shouldThrowAssignmentNotFoundException() {
		Long invalidAssignmentId = 10L;
		when(assignmentRepository.findById(Mockito.anyLong())).thenReturn(Optional.ofNullable(null));
		assertThatThrownBy(() -> assignmentService.getAssignmentById(invalidAssignmentId))
				.isInstanceOf(AssignmentNotFoundException.class);
		verify(assignmentRepository).findById(Mockito.anyLong());
	}

	@Test
	public void whenGetAssignmentByLocation_shouldReturnListAssignment() {
		List<Assignment> mockAssignmentList = new ArrayList<>();
		List<Asset> mockAssets = new ArrayList<Asset>();
		for (int i = 0; i < 10; i++) {
			Assignment assignment = new Assignment();
			Asset newAsset = new Asset();
			if (i % 2 == 0) {
				newAsset.setLocation("HN");
				mockAssets.add(newAsset);
			} else {
				newAsset.setLocation("HCM");
			}

			assignment.setAsset(newAsset);
			mockAssignmentList.add(assignment);
		}
		when(assetRepository.findByLocation(Mockito.anyString())).thenReturn(mockAssets);
		when(assignmentService.getAllAssignments()).thenReturn(mockAssignmentList);
		List<Assignment> actualResult = assignmentService.getAssignmentsByLocation("HN");
		assertEquals(actualResult.size(), mockAssets.size());
	}

	@Test
	void whenCreateAssignment_shouldReturnAssignmentAndChangeState() {
		Assignment stubAssignment = new Assignment();
		Asset stubAsset = new Asset();
		stubAsset.setCategory(new Category());
		stubAsset.setAssignments(new ArrayList<Assignment>());
		stubAssignment.setAsset(stubAsset);
		stubAssignment.setAssignedTo(new User());
		when(assignmentRepository.save(Mockito.any(Assignment.class))).thenReturn(stubAssignment);
		when(assetRepository.findById(Mockito.any())).thenReturn(Optional.ofNullable(stubAsset));
		AssignmentDTO dtoValid = assignmentService.convertToAssignmentDTO(stubAssignment);
		Assignment actualAssignment = assignmentService.createAssignment(dtoValid);
		assertNotNull(actualAssignment);
		assertEquals("Not available", stubAsset.getState());
	}

}
