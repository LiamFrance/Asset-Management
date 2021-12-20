package com.nashtech.assetmanagementwebservice.config;


import com.nashtech.assetmanagementwebservice.service.impl.UserDetailServiceImpl;
import com.nashtech.assetmanagementwebservice.utils.JwtTokenUtils;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final UserDetailsService jwtUserDetails;

    private final JwtTokenUtils jwtTokenUtils;

    @Autowired
    public JwtRequestFilter(UserDetailServiceImpl jwtUserDetails, JwtTokenUtils jwtTokenUtils) {
        this.jwtUserDetails = jwtUserDetails;
        this.jwtTokenUtils = jwtTokenUtils;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //get the header
        final String TokenInHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        if(TokenInHeader != null && TokenInHeader.startsWith("Bearer ")){
            jwtToken = TokenInHeader.substring(7);

            try {
                username = jwtTokenUtils.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                logger.warn("Unable to get JWT Token due to" +  e.getMessage());
            } catch (ExpiredJwtException e) {
                logger.warn("Token has expired" + e.getMessage());
            }
        }
        else{
            logger.warn("Token is not start with: 'Bearer '");
        }

        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            UserDetails userDetails = jwtUserDetails.loadUserByUsername(username);

            if(jwtTokenUtils.validateToken(jwtToken, userDetails)){
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                usernamePasswordAuthenticationToken.setDetails( new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
