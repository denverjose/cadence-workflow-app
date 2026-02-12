# Cadence Temporal Assessment

## Temporal Config (Replace with your values)

TEMPORAL_ADDRESS=localhost:7233
TEMPORAL_NAMESPACE=default
TEMPORAL_TASK_QUEUE=cadence-task-queue

---

## Install

npm install

---

## Run All

npm run dev

---

## Run Individually

npm run dev:web
npm run dev:api
npm run dev:worker

---

## Example API Calls

Create Cadence:
POST http://localhost:3001/cadences

Enroll Contact:
POST http://localhost:3001/enrollments

Update Running Workflow:
POST http://localhost:3001/enrollments/:id/update-cadence
