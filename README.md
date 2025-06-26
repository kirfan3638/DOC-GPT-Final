# DOC GPT Final

This repository demonstrates a basic setup for a HIPAA-conscious medical note application using React Native and a Node.js backend. It includes documentation in `docs/COURSE.md` outlining how to extend the project with AI-based search across clinical guidelines.

## Getting Started

1. Install dependencies in both the project root and `backend/`:
   ```bash
   npm install
   cd backend && npm install
   ```
2. Start the backend server:
   ```bash
   node server.js
   ```
3. Run the mobile app with React Native.

See [docs/COURSE.md](docs/COURSE.md) for a full walkthrough of the architecture and suggestions for HIPAA compliance.

## DOC IKGPT Web Setup

An optional Next.js dashboard with voice controls and AI-powered tools is available in `doc-ikgpt-web/`.

1. Navigate to the directory and install dependencies:

   ```bash
   cd doc-ikgpt-web && npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

The dashboard expects a `NEXT_PUBLIC_OPENAI_API_KEY` environment variable for OpenAI API access.

## Offline Setup

For environments without internet access, a helper script `setup-doc-gpt.sh` is
provided. Run this script on a machine with internet access to clone the
repository, install dependencies, and package each `node_modules` directory into
tar archives.

Transfer the generated archives to your offline machine and extract them in the
corresponding directories:

```bash
tar -xzf node_modules-root.tar.gz
tar -xzf node_modules-backend.tar.gz -C backend
# Optional dashboard
tar -xzf node_modules-web.tar.gz -C doc-ikgpt-web
```
