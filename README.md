# AWS Security Monitoring Dashboard (Starter)

A beginner-friendly full-stack starter for the GuardDuty + Security Hub CSPM project.

## Stack
- Frontend: React + Vite
- Backend: Java 17 + Spring Boot REST API
- Current mode: demo/sample findings stored in backend memory
- Planned next step: connect backend to AWS Security Hub / GuardDuty using an IAM role or temporary AWS Academy credentials

> Important: the dashboard's initial records are simulated sample findings. They are not live AWS findings. Do not put AWS credentials in the React frontend.

## Requirements
- Java 17+
- Maven 3.9+
- Node.js 20+ and npm

## Run the backend
Open a terminal in `backend`:
```bash
mvn spring-boot:run
```
Backend: http://localhost:8080
Health check: http://localhost:8080/api/health
Findings API: http://localhost:8080/api/findings

## Run the frontend
Open another terminal in `frontend`:
```bash
npm install
npm run dev
```
Open the URL printed by Vite (normally http://localhost:5173).

## What works
- View sample findings and severity/status summary
- Filter findings by status
- Open a finding and add investigation notes
- Change workflow status (NEW, NOTIFIED, RESOLVED)
- Frontend talks to the Spring Boot REST API

Data is held in memory, so changes reset when the backend restarts.

## Connect to AWS later
1. Use an IAM role where possible. In AWS Academy, use only the temporary credentials and permissions provided by the lab.
2. Keep credentials on the backend only; never add them to `.env` files served to the browser or to source control.
3. Add AWS SDK for Java v2 `software.amazon.awssdk:securityhub` and call Security Hub `GetFindings` in the same region as your enabled services (your notes say `us-east-1`).
4. Give the backend read-only permissions needed to list findings; add write permissions only if you deliberately implement AWS-side workflow updates.
5. Replace `FindingService`'s demo repository with a real AWS adapter. Keep the demo mode available for classroom presentation.
6. Security Hub findings may take a short time to appear after GuardDuty creates them. Test with clearly labeled sample findings first.

## API endpoints
- `GET /api/health`
- `GET /api/findings`
- `GET /api/findings/{id}`
- `PATCH /api/findings/{id}/status` body: `{"status":"NOTIFIED"}`
- `POST /api/findings/{id}/notes` body: `{"note":"Reviewed finding details"}`

## Suggested presentation flow
1. Start backend and frontend.
2. Show the dashboard counts.
3. Open the sample S3 anonymous-access finding.
4. Add a note and set status to NOTIFIED.
5. Explain that the current build demonstrates the app workflow with sample data; AWS live integration is a separate configuration step.
