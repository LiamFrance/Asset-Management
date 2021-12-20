package com.nashtech.assetmanagementwebservice.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.nashtech.assetmanagementwebservice.service.impl.UserDetailServiceImpl;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

	private final UserDetailsService userDetailsService;

	private final JwtRequestFilter jwtRequestFilter;

	@Autowired
	public SecurityConfig(JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
			UserDetailServiceImpl userDetailsService, JwtRequestFilter jwtRequestFilter) {
		this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
		this.userDetailsService = userDetailsService;
		this.jwtRequestFilter = jwtRequestFilter;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Autowired
	protected void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors();
		http.csrf().disable().authorizeRequests().antMatchers("/login", "/logout", "/authenticate").permitAll()
				.antMatchers("/users/*").access("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF')")
				.antMatchers("/assets", "/assets/*").access("hasAuthority('ROLE_ADMIN')")
				.antMatchers("/category", "/category/*").access("hasAuthority('ROLE_ADMIN')")
				.antMatchers("/assignments", "/assignments/*").access("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF')")
				.antMatchers(HttpMethod.GET,"/returns", "/returns/*").access("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF')")
				.antMatchers(HttpMethod.POST,"/returns", "/returns/*").access("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF')")
				.antMatchers(HttpMethod.DELETE, "/returns", "/returns/*").access("hasAuthority('ROLE_ADMIN')")
				.antMatchers(HttpMethod.PUT, "/returns", "/returns/*").access("hasAuthority('ROLE_ADMIN')")
				.anyRequest().authenticated().and()
				.exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint).and().sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
		http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
	}
}
