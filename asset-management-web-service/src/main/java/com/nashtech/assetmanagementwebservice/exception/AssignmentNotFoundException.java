package com.nashtech.assetmanagementwebservice.exception;

public class AssignmentNotFoundException extends RuntimeException {
	/**
	 *
	 */
	private static final long serialVersionUID = -7568903249550078904L;

	public AssignmentNotFoundException(String errorMessage) {
		super(errorMessage);
	}
}
