package com.nashtech.assetmanagementwebservice.utils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.nashtech.assetmanagementwebservice.domain.User;
import com.nashtech.assetmanagementwebservice.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtTokenUtils {

	private final UserRepository userRepository;

	@Autowired
	public JwtTokenUtils(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	private static final long JWT_TOKEN_VALID_TIME = 24 * 60 * 60 * 1000;

	private final String secret = "d52c249962ef2d25fcadacc7a7a0eb65933d4d33f380837b61f8424d36acc484";

	public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolve) {
		final Claims claims = getAllClaims(token);
		return claimsResolve.apply(claims);
	}

	public Claims getAllClaims(String token) {
		return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
	}

	public String getUsernameFromToken(String token) {
		return getClaimFromToken(token, Claims -> Claims.getSubject());
	}

	public Date getExpFromToken(String token) {
		return getClaimFromToken(token, Claims -> Claims.getExpiration());
	}

	public String getLocationFromToken(String token) {
		return getClaimFromToken(token, Claims -> Claims.get("location", String.class));
	}

	public boolean isExpiredToken(String token) {
		Date expiredDate = getExpFromToken(token);
		System.out.println(expiredDate.before(new Date()));
		return expiredDate.before(new Date());
	}

	public boolean validateToken(String token, UserDetails userDetails) {
		String username = getUsernameFromToken(token);
		return username.equals(userDetails.getUsername()) && !isExpiredToken(token);
	}

	public String generateToken(Map<String, Object> claims, String sub) {
		return Jwts.builder().setClaims(claims).setSubject(sub).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALID_TIME))
				.signWith(SignatureAlgorithm.HS512, secret).compact();
	}

	public String generateToken(UserDetails userDetails) {
		Map<String, Object> claims = new HashMap<>();
		User AppUser = userRepository.findAll().stream()
				.filter(user -> user.getUsername().equals(userDetails.getUsername())).findAny().get();
		String location = AppUser.getLocation();
		Boolean isVirgin = AppUser.isFirstTime();
		String type = userDetails.getAuthorities().stream().map(grantedAuthority -> grantedAuthority.getAuthority())
				.findAny().get();
		claims.put("type", type);
		claims.put("firstTime", isVirgin);
		claims.put("location", location);
		return generateToken(claims, AppUser.getUsername());
	}
}
