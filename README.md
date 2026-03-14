# RFC-Editor Diff Viewer

Website to compare different versions of a draft / RFC.

## Prerequisites

- Node.js 24.x

## Project Setup

1. Install npm dependencies:
   ```sh
   npm install
   ```
2. Duplicate `.env.sample` to `.env` and fill in the values.

## Run in Development Mode

In 2 separate terminals:

- Run the backend server with auto-restart: `npm run server:dev`
- Run the frontend with hot-reload: `npm run dev`

Open http://localhost:5173

## Build for Production

```sh
npm run build
```
