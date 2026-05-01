---
title: EventManagementSystem

---

# DB design

## Schema:

### Events
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "date": "string",
  "venue": "string",
  "capacity": "number"
}
```

### Registration
```json
{
  "_id": "ObjectId",
  "eventId": "string",
  "name": "string",
  "email": "string",
  "registeredAt": "datetime"
}
```

## Examples:
### 1. Events Collection
```json
{
  "_id": "663a1f8e9b2c4d0012a11111",
  "title": "AI Workshop",
  "description": "Introductory AI workshop",
  "date": "2026-05-10",
  "venue": "Seminar Hall",
  "capacity": 50
}
```
Fields:
```
_id          MongoDB ObjectId
title        event name
description  short event details
date         event date
venue        event location
capacity     max registrations allowed
```

### 2. Registrations Collection
```json
{
  "_id": "663a1f8e9b2c4d0012a22222",
  "eventId": "663a1f8e9b2c4d0012a11111",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "registeredAt": "2026-05-01T10:30:00Z"
}
```
Fields: 
```
_id            MongoDB ObjectId
eventId        ObjectId/string of the event
name           participant name
email          participant email
registeredAt  registration timestamp
```

### Relations:
```
events._id  ← registrations.eventId
```

## Routes:
Events routes (Devansh):
```
POST   /events
GET    /events
GET    /events/:id
PUT    /events/:id
DELETE /events/:id
GET    /health
```

Registration routes (Chiranjan):
```
POST   /registrations
GET    /registrations
GET    /registrations/{registration_id}
GET    /registrations/event/{event_id}
DELETE /registrations/{registration_id}
GET    /health
```

# Request-Response Schemas

## Event Routes 
### Use port 5001
#### 1. Create Events
```POST /events``` 
Request
```json
{
  "title": "AI Workshop",
  "description": "Intro to AI",
  "date": "2026-05-10",
  "venue": "Seminar Hall",
  "capacity": 50
}
```

Response (201)
```json
{
  "_id": "663a1f8e9b2c4d0012a11111",
  "title": "AI Workshop",
  "description": "Intro to AI",
  "date": "2026-05-10",
  "venue": "Seminar Hall",
  "capacity": 50,
  "createdAt": "2026-05-01T10:00:00Z"
}
```

---

#### 2. Get All Events
```GET /events``` 

Response (200)
```json
[
  {
    "_id": "663a1f8e9b2c4d0012a11111",
    "title": "AI Workshop",
    "date": "2026-05-10",
    "venue": "Seminar Hall"
  }
]
```

---

#### 3. Get Events by id
```GET /events/:id``` 

Response (200)
```json
{
  "_id": "663a1f8e9b2c4d0012a11111",
  "title": "AI Workshop",
  "description": "Intro to AI",
  "date": "2026-05-10",
  "venue": "Seminar Hall",
  "capacity": 50
}
```

Error 404

```json
{
  "error": "Event not found"
}
```

--- 

#### 4. Update Events
``` PUT /events/:id ```

Request
```json
{
  "title": "Advanced AI Workshop",
  "description": "Deep dive into AI",
  "date": "2026-05-12",
  "venue": "Auditorium",
  "capacity": 100
}
```

Response(200)
```json
{
  "_id": "663a1f8e9b2c4d0012a11111",
  "title": "Advanced AI Workshop",
  "description": "Deep dive into AI",
  "date": "2026-05-12",
  "venue": "Auditorium",
  "capacity": 100,
  "updatedAt": "2026-05-01T11:00:00Z"
}
```

--- 

#### 5. Delete Event
``` DELETE /events/:id```

Response(200)
```json
{
  "message": "Event deleted successfully"
}
```

---

#### 6. Health check
``` GET /health ```
Response (200)
```json
{
  "status": "Event service running"
}
```

## Registration Routes
### Use port 5002
#### 1. Create Registration
``` POST /registrations ``` 
Request
```json
{
  "eventId": "663a1f8e9b2c4d0012a11111",
  "name": "Rahul Sharma",
  "email": "rahul@example.com"
}
```

Response (201)
```json
{
  "_id": "663a1f8e9b2c4d0012a22222",
  "eventId": "663a1f8e9b2c4d0012a11111",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "registeredAt": "2026-05-01T10:30:00Z"
}
```

Error 400 (duplicate registration)
```json
{
  "error": "User already registered for this event"
}
```

---

#### 2. Get All Registrations
``` GET /registrations ```

Response 200
``` GET /registrations ```
```json
[
  {
    "_id": "663a1f8e9b2c4d0012a22222",
    "eventId": "663a1f8e9b2c4d0012a11111",
    "name": "Rahul Sharma",
    "email": "rahul@example.com"
  }
]
```

---

#### 3. Get Registration by ID

``` GET /registrations/{id} ```

Response 200
```json
{
  "_id": "663a1f8e9b2c4d0012a22222",
  "eventId": "663a1f8e9b2c4d0012a11111",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "registeredAt": "2026-05-01T10:30:00Z"
}
```

Error 404
```json
{
  "error": "Registration not found"
}
```

---

#### 4. Get Registrations by Event

``` GET /registrations/event/{eventId} ```

```json
[
  {
    "_id": "663a1f8e9b2c4d0012a22222",
    "eventId": "663a1f8e9b2c4d0012a11111",
    "name": "Rahul Sharma",
    "email": "rahul@example.com"
  }
]
```

---

#### 5. Delete Registration

``` DELETE /registrations/{id} ```

Response 200

```json
{
  "message": "Registration deleted successfully"
}
```

---

#### 6. Health Check

``` GET /health ```

Response 200
```json
{
  "status": "Registration service running"
}
```