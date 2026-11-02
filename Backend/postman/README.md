# Smart Job Matcher - Postman Collection & Guide

This directory contains the Postman Collection and Environment files for the **Smart Job Matcher** Backend REST API.

---

## 📁 Files Included

1. **`Smart_Job_Matcher.postman_collection.json`**  
   Contains all requests grouped into folders (`Health`, `Profile`, `Jobs`, `Notifications`, `Sync`), complete with sample payloads, query parameters, path variables, and saved example responses.

2. **`Smart_Job_Matcher.postman_environment.json`**  
   Pre-configured local environment containing `baseUrl` and `apiKey`.

---

## 🚀 How to Import into Postman

1. Open **Postman**.
2. Click **Import** (top-left button or `Ctrl + O` / `Cmd + O`).
3. Drag & drop or select both files:
   - `postman/Smart_Job_Matcher.postman_collection.json`
   - `postman/Smart_Job_Matcher.postman_environment.json`
4. Click **Import**.
5. In the top-right corner of Postman, select the **Smart Job Matcher - Local** environment from the environment dropdown.

---

## 🔑 Authentication Configuration

All `/api/*` endpoints require the header `x-api-key`.

1. Check your Backend `.env` file for your configured `API_KEY`:
   ```env
   API_KEY=your_secret_api_key_here
   ```
2. In Postman:
   - Either edit the **Smart Job Matcher - Local** environment variable `apiKey` to match your `.env` value.
   - Or edit the collection variable `apiKey` directly under the collection's **Variables** tab.

---

## 📡 API Endpoints Overview

### 1. Health
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Returns `{ "ok": true }` to verify server is active |

### 2. Profile
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/profile` | `x-api-key` | Fetch the candidate's profile, target titles, skills, and minimum score |
| `PUT` | `/api/profile` | `x-api-key` | Update the candidate's profile and matching parameters |

### 3. Jobs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | `x-api-key` | List all matched jobs (supports `?category=`, `?status=`, `?minScore=`) |
| `GET` | `/api/jobs?status=NOT_APPLIED&minScore=70` | `x-api-key` | Filter jobs not yet applied (`NEW` or `NOTIFIED`) with score >= 70 |
| `PATCH` | `/api/jobs/:id/status` | `x-api-key` | Update job status (`NEW`, `NOTIFIED`, `APPLIED`, `IGNORED`) |

### 4. Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | `x-api-key` | Get up to 100 recent match alerts |
| `PATCH` | `/api/notifications/:id/read` | `x-api-key` | Mark a notification as read |

### 5. Sync & AI Matching
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/sync/run` | `x-api-key` | Trigger background sync across job boards, run OpenAI scoring, and alert candidate |

---

## 💻 Quick Terminal Testing (cURL Examples)

Replace `YOUR_API_KEY` with your actual key:

```bash
# 1. Health Check
curl http://localhost:3000/health

# 2. Get Profile
curl -H "x-api-key: YOUR_API_KEY" http://localhost:3000/api/profile

# 3. Get Scored Jobs (min score 70)
curl -H "x-api-key: YOUR_API_KEY" "http://localhost:3000/api/jobs?minScore=70"

# 4. Trigger Job Sync & AI Match
curl -X POST -H "x-api-key: YOUR_API_KEY" http://localhost:3000/api/sync/run
```

