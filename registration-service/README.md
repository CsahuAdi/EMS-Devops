# Registration Service (FastAPI + MongoDB)

Run the registration service on port 5002. It depends on a running MongoDB and the Event service (for event validation).

Environment variables:

- `MONGODB_URI` (default `mongodb://localhost:27017`)
- `DB_NAME` (default `registrations_db`)
- `EVENT_SERVICE_URL` (default `http://localhost:5001`)

Run locally with:

```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 5002
```

Endpoints:

- `POST /registrations` — create registration (validates event by calling Event service)
- `GET /registrations` — list all
- `GET /registrations/{id}` — get by id
- `GET /registrations/event/{eventId}` — get registrations for an event
- `DELETE /registrations/{id}` — delete
- `GET /health` — health check
