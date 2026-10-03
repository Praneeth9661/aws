package com.praneeth.securitydashboard.service;

import com.praneeth.securitydashboard.model.Finding;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FindingService {
    private final Map<String, Finding> findings = new ConcurrentHashMap<>();

    @PostConstruct
    public void seedDemoData() {
        Instant now = Instant.now();
        add(new Finding("sample-001", "S3 public anonymous access granted", "HIGH",
                "shopping-assets-demo", "AwsS3Bucket", "GuardDuty", "NEW",
                "Sample finding only. Review bucket policy and public-access settings before deciding on remediation.",
                now.minusSeconds(900), true));
        add(new Finding("sample-002", "Unusual API activity (example)", "MEDIUM",
                "demo-employee-role", "AwsIamAccessKey", "GuardDuty", "NOTIFIED",
                "Sample finding only. Review principal, CloudTrail events, source context, and timeline.",
                now.minusSeconds(3600), true));
        add(new Finding("sample-003", "EC2 instance needs investigation (example)", "LOW",
                "i-demo1234567890", "AwsEc2Instance", "GuardDuty", "NEW",
                "Sample finding only. Correlate with instance metadata, network exposure, and relevant logs.",
                now.minusSeconds(7200), true));
    }

    private void add(Finding f) { findings.put(f.getId(), f); }
    public List<Finding> all() {
        return findings.values().stream()
                .sorted(Comparator.comparing(Finding::getCreatedAt).reversed()).toList();
    }
    public Optional<Finding> byId(String id) { return Optional.ofNullable(findings.get(id)); }

    public Finding updateStatus(String id, String status) {
        Finding f = require(id);
        Set<String> allowed = Set.of("NEW", "NOTIFIED", "RESOLVED");
        if (!allowed.contains(status)) throw new IllegalArgumentException("Status must be NEW, NOTIFIED, or RESOLVED.");
        f.setStatus(status);
        return f;
    }
    public Finding addNote(String id, String note) {
        Finding f = require(id);
        if (note == null || note.trim().isEmpty()) throw new IllegalArgumentException("Note cannot be empty.");
        f.getNotes().add(Instant.now() + " — " + note.trim());
        return f;
    }
    private Finding require(String id) {
        return byId(id).orElseThrow(() -> new NoSuchElementException("Finding not found: " + id));
    }
}
