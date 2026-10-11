# Stockroom

A two-page inventory demo built with React, Express, and MongoDB. The Overview page summarizes the catalog; Products supports create, read, update, and delete operations.

## Run locally

Requirements: Node.js 20+ and a running MongoDB server.

1. Run `npm install` from this folder.
2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` to your MongoDB connection string. For local MongoDB, the default URI is `mongodb://127.0.0.1:27017/stockroom`.
3. Run `npm run dev`.
4. Open `http://localhost:5173`.

The API runs at `http://localhost:3000`; Vite proxies `/api` requests to it during local development.

## Deploy the API to Render

The root `render.yaml` configures a Node web service using `server/` as its root directory. In Render, create a new Blueprint from this Git repository, or create a Web Service with root directory `server`, build command `npm install`, and start command `npm start`.

Set these Render environment variables:

- `MONGODB_URI`: the MongoDB Atlas application connection string, with `/stockroom` as its database path. Keep this value private.
- `FRONTEND_URL`: the exact Vercel production origin, such as `https://stockroom-demo.vercel.app`. Multiple origins can be comma-separated.
- `NODE_ENV`: `production` (provided by the Blueprint).

The production backend requires both `MONGODB_URI` and `FRONTEND_URL`; it does not fall back to local development URLs. Localhost defaults are used only when running outside production.

Render uses `/api/health` as its health check. Its public API URL will look like `https://stockroom-api.onrender.com`.

## Deploy the frontend to Vercel

Import this repository as a Vercel project and set **Root Directory** to `client`. Vercel detects Vite; use `npm run build` as the build command and `dist` as the output directory. The included `client/vercel.json` supports client-side page routing.

Add this Vercel environment variable for Production (and Preview if needed):

- `VITE_API_URL`: `https://YOUR-RENDER-SERVICE.onrender.com/api`

Replace the example host with the URL Render assigns to the API, then redeploy the Vercel project. Set Render's `FRONTEND_URL` to the Vercel origin and redeploy the Render service if needed.

## MongoDB Atlas

Create an Atlas cluster and a database user. In Atlas Network Access, allow connections from the Render service; for a quick demo, Atlas supports adding `0.0.0.0/0`, which permits connections from any IP and should only be used when appropriate for your demo. Use Atlas's application connection string for Render's `MONGODB_URI`, replacing the password placeholder and ensuring the URI selects the `stockroom` database. Atlas creates the database when the app first writes a product.

## API

- `GET /api/health` — server and database status
- `GET /api/products` — list products
- `GET /api/products/:id` — read one product
- `POST /api/products` — create a product
- `PUT /api/products/:id` — update a product
- `DELETE /api/products/:id` — delete a product

Product fields: `name`, `sku`, `category`, `price`, `quantity`, and optional `description`. SKU values are unique.
