package com.nashtech.assetmanagementwebservice.controller;

import java.time.LocalDate;
import java.util.List;

import com.nashtech.assetmanagementwebservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nashtech.assetmanagementwebservice.domain.Return;
import com.nashtech.assetmanagementwebservice.dto.ReturnDTO;
import com.nashtech.assetmanagementwebservice.service.ReturnService;

@RestController
@CrossOrigin
@RequestMapping("/returns")
public class ReturnController {

	private final ReturnService returnService;
	private final UserService userService;

	@Autowired
	public ReturnController(ReturnService returnService, UserService userService) {
		this.returnService = returnService;
		this.userService = userService;
	}

	@GetMapping("/astcode/{code}")
	public List<ReturnDTO> searchByAssetCode(@PathVariable String code) {
		return returnService.searchByAssetCode(code);
	}

	@GetMapping("/astname/{name}")
	public List<ReturnDTO> searchByAssetName(@PathVariable String name) {
		return returnService.searchByAssetName(name);
	}

	@GetMapping("/rqname/{username}")
	public List<ReturnDTO> searchByRequesterUsername(@PathVariable String username) {
		return returnService.searchByRequester(username);
	}

	@PostMapping("")
	public ReturnDTO createRequest(@RequestBody ReturnDTO returnDTO) {
		if (!(returnService.isRequestPending(returnDTO.getAssignment()))) {
			return null;
		}
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		returnDTO.setRequestedBy(authentication.getName());
		return returnService.create(returnDTO);
	}

	@PutMapping("/{id}")
	public ReturnDTO completeOrCancelRequest(@PathVariable String id, @RequestParam String action) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		ReturnDTO returnDTO = new ReturnDTO();
		Return r = returnService.getById(Long.valueOf(id));
		if ("complete".equals(action)) {
			r.setAcceptedBy(authentication.getName());
			returnDTO = returnService.complete(r);
		}
		if ("cancel".equals(action)) {
			returnDTO = returnService.cancel(r);
		}
		return returnDTO;
	}

	@GetMapping("")
	public List<ReturnDTO> getAssignmentsByState(@RequestParam(name = "state", defaultValue = "") String state,
			@RequestParam(name = "returnedDate", defaultValue = "") String returnedDate) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String location = userService.getLocationByUsername(authentication.getName());
		if (state.equals("") && returnedDate.equals("")) {
			return returnService.getAll(location);
		}
		if (!state.equals("") && !returnedDate.equals("")) {
			return returnService.filterByStateAndReturnedDate(state, LocalDate.parse(returnedDate), location);
		}
		if (returnedDate.equals("")) {
			return returnService.filterByState(state, location);
		}
		return returnService.filterByReturnedDate(LocalDate.parse(returnedDate), location);
	}

}
