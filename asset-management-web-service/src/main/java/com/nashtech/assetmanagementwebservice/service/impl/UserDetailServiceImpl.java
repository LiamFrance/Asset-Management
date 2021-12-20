package com.nashtech.assetmanagementwebservice.service.impl;

import com.nashtech.assetmanagementwebservice.domain.User;
import com.nashtech.assetmanagementwebservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import  org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;


@Service
public class UserDetailServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public UserDetailServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findAll().stream().filter(u -> u.getUsername().equals(username)).findFirst().orElse(null);
        if(user == null){
            throw new UsernameNotFoundException("User not Found");
        }
        return buildUserDetails(user);
    }

    public UserDetails buildUserDetails(User user){
        UserBuilder builder = org.springframework.security.core.userdetails.User.withUsername(user.getUsername());
        builder.password(user.getPassword());
        builder.authorities(getAuthorities(user.getType()));
        return builder.build();
    }

    private Collection<GrantedAuthority> getAuthorities(String role){
        Collection<GrantedAuthority> xxx = new ArrayList<>();
        if(role != null){
            xxx.add(new SimpleGrantedAuthority("ROLE_"+role.toUpperCase()));
        }
        return xxx;
    }
}
