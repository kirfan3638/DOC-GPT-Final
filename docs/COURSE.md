# DOC GPT Course

This course provides a step-by-step guide for creating a HIPAA-compliant medical note application that integrates AI-based search with clinical guidelines.

## Overview

- **Frontend**: React Native app for capturing patient notes and user authentication.
- **Backend**: Node.js + Express server for securely storing notes and providing AI-powered search functionality.
- **Guideline Sources**: Integrate authoritative resources such as AHA, IDSA, ACP, and gastroenterology guidelines.
- **HIPAA Considerations**: Ensure data encryption, authentication, and audit logging.

## Contents

1. [Project Setup](#project-setup)
2. [Frontend Walkthrough](#frontend-walkthrough)
3. [Backend Walkthrough](#backend-walkthrough)
4. [AI and Guideline Search](#ai-and-guideline-search)
5. [Transcription Timestamps](#transcription-timestamps)
6. [Deployment Notes](#deployment-notes)

## Project Setup

1. Install Node.js and React Native development tools.
2. Clone this repository.
3. Run `npm install` inside both `frontend/` and `backend/` directories.
4. Start the backend with `node backend/server.js`.
5. Run the mobile app using `npx react-native run-android` or `run-ios`.

## Frontend Walkthrough

The `App.js` file contains a simple login screen and a note editor. When a note is saved, it is sent to the backend along with a timestamp.

```jsx
await fetch('http://localhost:3000/notes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ note, timestamp: new Date().toISOString() }),
});
```

Authentication should use secure tokens in production.

## Backend Walkthrough

The backend (`backend/server.js`) exposes a `/notes` endpoint to receive and store notes. Data should be encrypted and stored in a secure database. This example demonstrates basic functionality; you must implement proper security controls for real deployments.

## AI and Guideline Search

To provide deep search across medical guidelines:

1. Aggregate documents from trusted sources (AHA, IDSA, ACP, etc.).
2. Index these documents using a search engine (e.g., Elasticsearch) or embeddings.
3. Integrate OpenAI or a similar model to summarize and answer questions using the indexed guidelines.

Always verify responses against official documents to maintain clinical accuracy.

## Transcription Timestamps

Each note submission includes a timestamp generated on the client. The backend can store this value and also log server receipt time. These timestamps help track when a patient's transcription was created and reviewed.

## Deployment Notes

HIPAA compliance requires administrative, technical, and physical safeguards:

- Encrypt data in transit (HTTPS) and at rest.
- Implement user authentication and role-based access control.
- Maintain audit logs of who accesses patient information.
- Sign Business Associate Agreements (BAAs) with any third-party service handling protected health information.

This repository serves as a starting point for building your HIPAA-compliant medical note application.
