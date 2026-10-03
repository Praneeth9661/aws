package com.praneeth.securitydashboard.controller;

import com.praneeth.securitydashboard.model.Finding;
import com.praneeth.securitydashboard.service.FindingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FindingController {
    private final FindingService service;
    public FindingController(FindingService service) { this.service = service; }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "mode", "DEMO_SAMPLE_DATA");
    }
    @GetMapping("/findings")
    public List<Finding> all() { return service.all(); }
    @GetMapping("/findings/{id}")
    public Finding one(@PathVariable String id) { return service.byId(id).orElseThrow(() -> new NoSuchElementException("Finding not found: " + id)); }
    @PatchMapping("/findings/{id}/status")
    public Finding updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return service.updateStatus(id, body.getOrDefault("status", ""));
    }
    @PostMapping("/findings/{id}/notes")
    public Finding addNote(@PathVariable String id, @RequestBody Map<String, String> body) {
        return service.addNote(id, body.get("note"));
    }

    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> notFound(Exception e) { return Map.of("error", e.getMessage()); }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> badRequest(Exception e) { return Map.of("error", e.getMessage()); }
}
