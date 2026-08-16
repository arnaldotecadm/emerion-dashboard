# GET /api/v1/notifications — Field summary (compact)

Purpose: Notification inbox for users.

Key fields:
- id: number
- userId: number
- category: string
- status: string (UNREAD/READ/DISMISSED)
- title: string
- body: string
- createdAt: string

Actions:
- PATCH /notifications/{id}/read
- PATCH /notifications/{id}/dismiss

Example: { "data": [{ "id": 77, "category": "INGESTION", "status": "UNREAD" }] }