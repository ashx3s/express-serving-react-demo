# Server

The Express server has two responsibilities in this demo: serving the compiled React app as static files, and exposing API routes that the client can fetch data from.

## How It Works

### Static File Serving

`express.static` points at `client/dist/` — the output of Vite's build. When a request comes in for a known asset (JS bundles, CSS, images), Express finds the file and returns it directly. Any request that doesn't match a file on disk falls through to the next handler.

### API Routes

API routes (prefixed `/api/`) are defined **before** the SPA fallback. This ensures Express handles them directly and returns JSON rather than falling through to serve `index.html`.

```js
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the Express server!", timestamp: new Date().toISOString() });
});
```

In a real application, this is where you would:

- Connect to a database and return data
- Handle authentication (login, logout, token verification)
- Protect routes with middleware before the handler runs
- Validate and sanitize incoming request data

### SPA Fallback

Any request that doesn't match a static file or an API route is caught by the wildcard handler:

```js
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});
```

This serves `index.html` for every unrecognised path, which hands control to React Router to render the correct page on the client side. Without this, a hard refresh on `/about` would return a 404 from the server instead of loading the app.

### Error Handler

A standard Express error-handling middleware (four arguments: `err, req, res, next`) sits at the bottom as a safety net for any unhandled errors thrown by route handlers. Express identifies it as an error handler specifically because of the four-parameter signature.

## Route Order Matters

Express matches routes in the order they are defined. The order in `index.js` is intentional:

1. `express.static` — serve real files first
2. `/api/*` routes — handle API requests before the fallback can intercept them
3. `/*splat` — catch everything else and serve `index.html`
4. Error handler — catch any thrown errors

If an API route were defined after `/*splat`, it would never be reached.

## Scripts

Run from the **root** of the project:

| Command | Description |
|---|
---|
| `npm run build` | Build the React client into `client/dist/` |
| `npm run dev` | Start the server with `--watch` (auto-restarts on file changes) |
| `npm start` | Start the server in production mode |

> Always run `npm run build` before starting the server — otherwise there are no compiled client files for Express to serve.