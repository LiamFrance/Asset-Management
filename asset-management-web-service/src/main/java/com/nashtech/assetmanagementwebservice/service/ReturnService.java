package com.nashtech.assetmanagementwebservice.service;

import java.time.LocalDate;
import java.util.List;

import com.nashtech.assetmanagementwebservice.domain.Return;
import com.nashtech.assetmanagementwebservice.dto.AssignmentDTO;
import com.nashtech.assetmanagementwebservice.dto.ReturnDTO;

public interface ReturnService {
	ReturnDTO create(ReturnDTO returnDTO);

	ReturnDTO cancel(Return r);

	ReturnDTO complete(Return r);

	List<ReturnDTO> searchByAssetCode(String code);

	List<ReturnDTO> searchByAssetName(String name);

	List<ReturnDTO> searchByRequester(String username);

	public Return getById(Long id);

	List<ReturnDTO> getAll(String location);

	List<ReturnDTO> filterByState(String state, String location);

	List<ReturnDTO> filterByReturnedDate(LocalDate assignedDate, String location);

	List<ReturnDTO> filterByStateAndReturnedDate(String state, LocalDate date, String location);

	boolean isRequestPending(AssignmentDTO assignment);
}
