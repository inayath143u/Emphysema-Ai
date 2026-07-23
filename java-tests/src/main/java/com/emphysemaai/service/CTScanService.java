package com.emphysemaai.service;

import java.io.File;

public class CTScanService {
    
    public double calculateSeverityScore(File imageFile) {
        if (imageFile == null || !imageFile.exists()) {
            throw new IllegalArgumentException("Invalid file supplied");
        }
        
        long size = imageFile.length();
        if (size > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }
        
        // Mock scan severity calculation based on name hash
        return Math.abs(imageFile.getName().hashCode() % 100);
    }

    public String classifySeverity(double severityScore) {
        if (severityScore < 0 || severityScore > 100) {
            return "Invalid Score";
        }
        if (severityScore < 30) {
            return "Healthy";
        } else if (severityScore < 60) {
            return "Moderate";
        } else {
            return "Critical";
        }
    }
}
