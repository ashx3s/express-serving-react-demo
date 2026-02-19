# Express + React Demo

A minimal full-stack demo showing how to serve a React single-page application (SPA) from an Express server inside a single repository.

## Purpose

This project is designed to illustrate the simplest possible working setup for:

- Organizing a frontend and backend together in one repo (a "monorepo" structure)
- Serving a compiled React app as static files from Express
- Defining API routes on the same server the frontend is served from
- Understanding how client-side routing (React Router) and server-side routing (Express) work alongside each other

It is intentionally minimal — no database, no authentication system, no complex build pipeline — so the architecture is easy to follow without noise.

## Project Structure

```
express-react-demo/
├── client/             # React app (Vite + React Router)
│   └── src/
│       ├── pages/      # Route-level page components
│       └── main.jsx    # React Router setup
├── server/             # Express server
│   └── index.js        # Static file serving, API routes, SPA fallback
└── package.json        # Root scripts (build, dev, start)
```

## How It Works

1. The React app is built with Vite (`npm run build`), producing a `client/dist/` folder of optimized static files.
2. Express serves those static files via `express.static`.
3. API routes (e.g. `GET /api/hello`) are defined directly on the same Express server, before the fallback route.
4. A wildcard catch-all route (`/*splat`) serves `index.html` for any unrecognised path, allowing React Router to handle client-side navigation on the frontend.

---

## Monorepo vs. Separated Repos

> **Note:** This unified architecture — a single server that handles both the frontend and the API — is a convenient and approachable starting point, but it is **not** always the right choice for production.

### When the unified approach (this demo) makes sense

- Prototypes, internal tools, or admin dashboards where simplicity matters most
- Small projects where a single deployment target reduces operational
 overhead
- When the same small team owns both the frontend and backend
- When there is only one client (the web app) consuming the API
- When you want everything on one domain and don't need a CDN for the frontend

### When to split the frontend and backend into separate deployments

- When the frontend and backend need to scale independently under different loads
- When the React app should be served from a CDN (e.g. Vercel, Netlify, Cloudflare Pages) for performance and global distribution
- When multiple clients — web, mobile app, third-party integrations — all consume the same API
- When separate teams own the frontend and backend and need independent deployment pipelines
- When the backend is part of a larger API ecosystem or microservices architecture

In the split model, the Express server would serve **only API routes**. There would be no `express.static`, no SPA fallback, and no awareness of the frontend at all. The React app would live in its own repo (or a separate workspace), be deployed independently, and make HTTP requests to the API's URL.

---

## Security Considerations

The architecture you choose has direct security implications that are worth understanding early.

### Unified (this demo)

- Both the app and the API share the **same origin**, so there are no CORS issues. The browser treats requests to `/api/*` as same-origin by default.
- Session cookies work simply using `SameSite=Strict` since everything lives on one domain.
- `express.static` should always point to a dedicated build output directory (e.g. `client/dist/`), **never** the project root — otherwise you risk accidentally exposing source files, `.env` files, or `node_modules`.
- Because the server and the built frontend are deployed together, you must be disciplined about what goes into `client/dist/` and what stays server-side.

### Split (separate frontend and backend)

- You **must configure CORS** on the Express server to explicitly allow the frontend's origin. Misconfigured or overly permissive CORS (`origin: "*"`) is a common and serious vulnerability, especially when credentials are involved.
- Cookies with `SameSite=Strict` do not work cross-origin. You'll typically use `SameSite=None; Secure` (requiring HTTPS), or shift to token-based authentication (e.g. JWTs in `Authorization` headers) instead.
- The API is publicly reachable on its own domain, so every route must be protected with proper authentication, authorization, and input validation — there is no "security through obscurity" from bundling it with the frontend.
- The frontend, served via a CDN, can be deployed globally with no backend involvement, which is a significant performance and availability win.

---

## Deployment

### Unified (this demo)

Deploy the whole project to a single Node.js hosting platform (e.g. Railway, Render, Fly.io, or a VPS). The one server process handles everything.

```
npm run build   # Build the React client into client/dist/
npm start       # Start the Express server to serve it
```

### Split

- Deploy the **React app** to a static hosting provider (Vercel, Netlify, Cloudflare Pages, an S3 bucket + CloudFront, etc.)
- Deploy the **Express API** separately (Railway, Render, Fly.io, a VPS, etc.)
- Configure the frontend to point at the backend's URL via an environment variable (e.g. `VITE_API_URL=https://api.yoursite.com`)

---

## Scripts

Run from the root of the project:

| Command | Description |
|---|---|
| `npm run build` | Build the React client into `client/dist/` |
| `npm run dev` | Start the Express server in watch mode (auto-restarts on changes) |
| `npm start` | Start the Express server in production mode |

> Always run `npm run build` before `npm run dev` or `npm start`. Without a compiled client, Express has no static files to serve.