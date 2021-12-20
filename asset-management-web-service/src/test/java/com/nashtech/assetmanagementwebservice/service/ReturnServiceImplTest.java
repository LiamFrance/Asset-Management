package com.nashtech.assetmanagementwebservice.service;

import com.nashtech.assetmanagementwebservice.domain.*;
import com.nashtech.assetmanagementwebservice.dto.AssignmentDTO;
import com.nashtech.assetmanagementwebservice.dto.ReturnDTO;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nashtech.assetmanagementwebservice.repository.AssetRepository;
import com.nashtech.assetmanagementwebservice.repository.AssignmentRepository;
import com.nashtech.assetmanagementwebservice.repository.ReturnRepository;
import com.nashtech.assetmanagementwebservice.service.impl.ReturnServiceImpl;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReturnServiceImplTest {
	@Mock
	public AssignmentRepository assignmentRepository;

	@Mock
	public AssetRepository assetRepository;

	@Mock
	public ReturnRepository returnRepository;

	public ReturnServiceImpl returnService;

	@BeforeEach
	public void init() {
		this.returnService = new ReturnServiceImpl(assignmentRepository, assetRepository, returnRepository);
	}

	@Test
	public void whenGetAll_shouldReturnListRequest(){
		List<Return> returnList = new ArrayList<>();
		List<Assignment> mockAsm = new ArrayList<>();
		for (int i = 0; i < 3; i++) {
			Assignment asm = new Assignment();
			asm.setId((long) i);
			asm.setState("Waiting for accepting");
			mockAsm.add(asm);
		}
		for (int i = 0; i < 3; i++) {
			Return r = new Return();
			Assignment a = new Assignment();
			User u = new User();
			Asset as = new Asset();
			Category c = new Category();
			c.setName("LT");
			as.setAssetName("Laptop");
			as.setCategory(c);
			as.setAssignments(mockAsm);
			a.setAsset(as);
			u.setLocation("HN");
			a.setAssignedTo(u);
			r.setAssignment(a);
			returnList.add(r);
		}
		when(returnRepository.findAll()).thenReturn(returnList);
		Assertions.assertEquals(3, returnService.getAll("HN").size());
		Assertions.assertEquals(0,returnService.getAll("HCM").size());
		verify(returnRepository, times(2)).findAll();
	}

	@Test
	public void WhenCreateReturnRequest_ShouldReturnAReturnDTO(){
		List<Assignment> mockAsm = new ArrayList<>();
		for (int i = 0; i < 3; i++) {
			Assignment asm = new Assignment();
			asm.setId((long) i);
			asm.setState("Waiting for accepting");
			mockAsm.add(asm);
		}

		Return r = new Return();
		Assignment a = new Assignment();
		User u = new User();
		Asset as = new Asset();
		Category c = new Category();
		c.setName("LT");
		as.setAssetName("Laptop");
		as.setCategory(c);
		as.setAssignments(mockAsm);
		a.setAsset(as);
		u.setLocation("HN");
		a.setAssignedTo(u);
		r.setAssignment(a);

		when(returnRepository.save(any())).thenReturn(r);
		when(assignmentRepository.getById(anyLong())).thenReturn(a);
		ReturnDTO returnDTO = new ReturnDTO();
		AssignmentDTO assignmentDTO = new AssignmentDTO();
		assignmentDTO.setId(1L);
		returnDTO.setAssignment(assignmentDTO);
		Assertions.assertNotNull(returnService.create(returnDTO));
		verify(returnRepository,times(1)).save(any());
	}
}

