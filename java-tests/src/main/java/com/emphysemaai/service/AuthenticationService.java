package com.emphysemaai.service;

import java.util.HashMap;
import java.util.Map;

public class AuthenticationService {
    private final Map<String, String> userDb = new HashMap<>();

    public AuthenticationService() {
        // Pre-populating default credentials
        userDb.put("patient@test.com", "password123");
        userDb.put("doctor@test.com", "doctorsecure");
    }

    public boolean register(String email, String password, String name, String role) {
        if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
            return false;
        }
        if (userDb.containsKey(email)) {
            return false;
        }
        userDb.put(email, password);
        return true;
    }

    public boolean login(String email, String password) {
        if (email == null || password == null) {
            return false;
        }
        return password.equals(userDb.get(email));
    }
}
