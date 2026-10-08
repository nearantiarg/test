# Greene Plumbing & Heating — Unofficial redesign concept

A responsive, accessible marketing website prototype for the lowest-rated *verified local* HVAC-adjacent contractor in the supplied directory (tied at 1.9/5). This project is not endorsed by or connected to Greene Plumbing & Heating Co.

## Run

Requires Node.js 18+; no third-party packages.

```bash
npm start
# open http://localhost:3000
```

## Features

- Responsive single-page site, mobile navigation, service cards, accessible request form.
- Real POST `/api/requests` endpoint: validates submissions and saves to `data/requests.json` on the server.
- Admin GET `/api/requests` endpoint protected by `ADMIN_TOKEN` environment variable and `Authorization: Bearer <token>` header.
- Honeypot field, server-side validation, random request IDs, no fictional reviews, certifications, or pricing.

## Before production

- Obtain the company's permission to use its identity or deploy as its official website.
- Confirm the real phone, address, services, licenses, operating hours, emergency availability, and service area.
- Configure a persistent encrypted database, HTTPS, spam/rate limiting, privacy policy, retention and consent requirements, secure admin login, email/SMS notifications, and backup procedures.
- The current JSON storage is for a demo/single-instance server only; ephemeral hosting can lose requests. No actual appointment is booked or notification sent.
- Fonts are loaded from Google Fonts; swap for locally hosted fonts if needed.

## Deployment

Deploy to a Node.js host with persistent storage and `ADMIN_TOKEN` set. GitHub Pages cannot run the request API. For static-only hosting, the form must be replaced with an external form provider or backend.
