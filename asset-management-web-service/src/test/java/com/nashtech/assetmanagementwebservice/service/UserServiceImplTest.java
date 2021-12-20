package com.nashtech.assetmanagementwebservice.service;

import com.fasterxml.jackson.annotation.JsonIgnoreType;
import com.nashtech.assetmanagementwebservice.domain.Asset;
import com.nashtech.assetmanagementwebservice.domain.Assignment;
import com.nashtech.assetmanagementwebservice.domain.Category;
import com.nashtech.assetmanagementwebservice.domain.User;
import com.nashtech.assetmanagementwebservice.dto.AssetDTO;
import com.nashtech.assetmanagementwebservice.dto.AssignmentDTO;
import com.nashtech.assetmanagementwebservice.dto.UserDTO;
import com.nashtech.assetmanagementwebservice.mapper.UserMapper;
import com.nashtech.assetmanagementwebservice.repository.AssignmentRepository;
import com.nashtech.assetmanagementwebservice.repository.UserRepository;
import com.nashtech.assetmanagementwebservice.service.impl.UserServiceImpl;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


import static org.junit.Assert.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    UserRepository userRepository;

    UserServiceImpl userService;

    AssignmentRepository assignmentRepository;

    @Before
    public void setup(){
        userRepository = mock(UserRepository.class);
        assignmentRepository = mock(AssignmentRepository.class);
        userService = new UserServiceImpl(userRepository,assignmentRepository, new BCryptPasswordEncoder());
    }

    @Test
    public void whenGetAll_shouldReturnListUsers(){
        List<User> mockUserList = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            mockUserList.add(new User());
        }
        when(userRepository.findAll()).thenReturn(mockUserList);
        List<UserDTO> underTest =  userService.getAll();
        assertEquals(underTest.size(), userRepository.findAll().size());
        verify(userRepository, times(2)).findAll();
    }

    @Test
    public void whenGetByID_shouldReturnUser(){
        User user = new User();
        user.setId("SD3693");
        user.setUsername("checked");
        Optional<User> mockUser = Optional.of(user);
        when(userRepository.findById("SD3693")).thenReturn(mockUser);
        Optional<UserDTO> underTest = Optional.of(userService.getUserById("SD3693"));
        assertEquals(underTest.get().getUsername(), userRepository.findById("SD3693").get().getUsername());
        verify(userRepository, times(2)).findById("SD3693");
    }

    @Test
    public void whenGetByUserName_shouldReturnUser(){
        User mockUser = new User();
        mockUser.setId("SD3693");
        mockUser.setUsername("checked");
        when(userRepository.findUserByUsername("checked")).thenReturn(mockUser);
        User underTest = userService.getUserByUsername("checked");
        assertEquals(underTest, userRepository.findUserByUsername("checked"));
        verify(userRepository, times(2)).findUserByUsername("checked");
    }

    @Test
    public void whenGetLocationByUsername_shouldReturnStringLocation(){
        User mockUser = new User();
        mockUser.setId("SD3693");
        mockUser.setUsername("checked");
        mockUser.setLocation("HaeNoy");
        when(userRepository.findLocationByUsername("checked")).thenReturn(mockUser.getLocation());
        String actualLocation = userService.getLocationByUsername("checked");
        assertEquals(actualLocation, userRepository.findLocationByUsername("checked"));
        verify(userRepository, times(2)).findLocationByUsername("checked");
    }

    @Test
    public void whenGetUserByLocation_shouldReturnListUser(){
        List<User> mockUserList = new ArrayList<>();
        for (int i = 0; i < 6; i++) {
            User user = new User();
            user.setLocation("HeaNoy");
            mockUserList.add(new User());
        }
        when(userRepository.findByLocation("HeaNoy")).thenReturn(mockUserList);
        List<UserDTO> underTest =  userService.getUserByLocation("HeaNoy");
        assertEquals(underTest.size(), userRepository.findByLocation("HeaNoy").size());
        verify(userRepository, times(2)).findByLocation("HeaNoy");
    }

    @Test
    public void whenCreateUser_shouldReturnUser(){
        UserDTO stubDto = new UserDTO();
        stubDto.setFirstName("Alibaba");
        stubDto.setLastName("Ololololo Lolol");
        stubDto.setDob(LocalDate.now());
        when(userRepository.getIdUserToGen()).thenReturn("SD0000");
        User mockUser = userService.convertToUser(stubDto);
        System.out.println(mockUser);
        System.out.println(userRepository.getIdUserToGen());
        when(userRepository.save(any())).thenReturn(mockUser);
        System.out.println(userRepository.save(mockUser));
        UserDTO actual = userService.create(stubDto);
        assertNotNull(actual);
    }
}
