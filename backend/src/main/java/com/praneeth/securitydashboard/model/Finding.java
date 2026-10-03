package com.praneeth.securitydashboard.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class Finding {
    private String id;
    private String title;
    private String severity;
    private String resource;
    private String resourceType;
    private String product;
    private String status;
    private String description;
    private Instant createdAt;
    private List<String> notes = new ArrayList<>();
    private boolean sample;

    public Finding() {}
    public Finding(String id, String title, String severity, String resource, String resourceType,
                   String product, String status, String description, Instant createdAt, boolean sample) {
        this.id=id; this.title=title; this.severity=severity; this.resource=resource;
        this.resourceType=resourceType; this.product=product; this.status=status;
        this.description=description; this.createdAt=createdAt; this.sample=sample;
    }
    public String getId(){return id;} public void setId(String v){id=v;}
    public String getTitle(){return title;} public void setTitle(String v){title=v;}
    public String getSeverity(){return severity;} public void setSeverity(String v){severity=v;}
    public String getResource(){return resource;} public void setResource(String v){resource=v;}
    public String getResourceType(){return resourceType;} public void setResourceType(String v){resourceType=v;}
    public String getProduct(){return product;} public void setProduct(String v){product=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;}
    public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public Instant getCreatedAt(){return createdAt;} public void setCreatedAt(Instant v){createdAt=v;}
    public List<String> getNotes(){return notes;} public void setNotes(List<String> v){notes=v;}
    public boolean isSample(){return sample;} public void setSample(boolean v){sample=v;}
}
