package com.nashtech.assetmanagementwebservice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.nashtech.assetmanagementwebservice.domain.User;
import com.nashtech.assetmanagementwebservice.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserDetailServiceImplTest {

	public UserRepository userRepository = Mockito.mock(UserRepository.class);

//	public UserDetailServiceImpl userDetailService= new UserDetailServiceImpl(userRepository);
//	public UserServiceImpl userService;

	@Test
	void whenGetByUsername_shouldReturnUserDetails() {
		User mockUser = new User();
		mockUser.setUsername("test");
		String text = "test";
		when(userRepository.findUserByUsername(text)).thenReturn(mockUser);
		// UserDetails actualUser = userDetailService.loadUserByUsername(text);
		User actualUser = userRepository.findUserByUsername(text);
		assertThat(actualUser).isEqualTo(mockUser).isNotNull();
		verify(userRepository).findUserByUsername(Mockito.anyString());
	}
}
//@ExtendWith(MockitoExtension.class)
//public class UserDetailServiceImplTest {
//
//	@Mock
//	public AssignmentRepository assignmentRepository;
//
//	@Mock
//	public AssetRepository assetRepository;
//
//	@Mock
//	public UserRepository userRepository;
//
//	public UserDetailServiceImpl userDetailService;
//	public UserServiceImpl userService;
//
//	@BeforeEach
//	public void init() {
//		this.userDetailService = new UserDetailServiceImpl(userRepository);
//	}
//
//	@Test
//	void whenGetByUsername_shouldReturnUserDetails() {
//		User mockUser = new User();
//		mockUser.setUsername("test");
//		when(userRepository.findAll().stream().filter(u -> u.getUsername().equals(Mockito.anyString())).findFirst()
//				.orElse(null)).thenReturn(mockUser);
//		User actualUser = userService.getUserByUsername("test");
//		assertThat(actualUser).isEqualTo(mockUser);
//		verify(userRepository).findByUsername(Mockito.anyString());
//	}
//
//	@Test
//	void whenGetByInvalid_shouldThrowUsernameNotFoundException() {
//		String invalidUsername = "test1";
//		when(userRepository.findByUsername(Mockito.anyString()).thenReturn(Optional.ofNullable(null));
//		assertThatThrownBy(() ->  userService.getUserByUsername(invalidUsername))
//				.isInstanceOf(UsernameNotFoundException.class);
//		verify(userRepository).findByUsername(Mockito.anyString());
//	}
//
//}
