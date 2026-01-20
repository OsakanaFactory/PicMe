package com.picme.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "PicMe Backend");
        response.put("version", "0.0.1-SNAPSHOT");

        try (Connection connection = dataSource.getConnection()) {
            response.put("database", "Connected");
            response.put("databaseUrl", connection.getMetaData().getURL());
        } catch (Exception e) {
            response.put("database", "Disconnected");
            response.put("error", e.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}
