# NoteShare — Notes Sharing Platform

A full-stack Notes Sharing Platform built with **React (Vite)** + **Spring Boot** + **MySQL**.

---

## Project Structure

```
notes project/
  backend/          ← Spring Boot Maven project (port 8080)
  frontend/         ← React Vite app (port 5173)
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| MySQL | 8.x |

---

## Database Setup

1. Start MySQL and run:

```sql
CREATE DATABASE IF NOT EXISTS notesdb;
```

> The schema (tables) will be auto-created by Hibernate on first run (`ddl-auto=update`).

2. Update credentials in `backend/src/main/resources/application.properties` if your MySQL password differs from `root`.

---

## Running the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs at **http://localhost:8080**

---

## Running the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at **http://localhost:5173**  
API requests are proxied to the backend automatically.

---

## Features

| Feature | Description |
|---------|-------------|
| Signup / Login | JWT-based authentication stored in localStorage |
| Upload Notes | Title, description, file (PDF/images), public or private |
| My Notes | View, copy shareable link, delete your notes |
| Browse | Search all public notes by title/description |
| Note Detail | `/notes/:id` — download button + share link |
| Access Control | Public notes = anyone; Private = owner only |

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/signup` | No | Register |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/notes/public` | No | All public notes |
| GET | `/api/notes/{id}` | Optional | Get note (private needs auth) |
| GET | `/api/notes/my` | Yes | Your notes |
| POST | `/api/notes/upload` | Yes | Upload a note |
| GET | `/api/notes/download/{id}` | Optional | Download file |
| DELETE | `/api/notes/{id}` | Yes | Delete your note |
