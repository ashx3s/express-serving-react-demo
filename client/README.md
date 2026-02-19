# Client

The React frontend, built with [Vite](https://vite.dev) and [React Router v7](https://reactrouter.com/).

## Routing

Client-side routing is handled by React Router. The router is configured in `main.jsx` and wraps the entire app in a `<BrowserRouter>`, which uses the browser's History API to navigate between pages without triggering full page reloads.

```jsx
<BrowserRouter>
  <Routes>
    <Route index element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Routes

| Path | Component | Description |
|---|---|---|
| `/` | `Home` | The home/index page |
| `/about` | `About` | About page |
| `*` | `NotFound` | Catch-all 404 page for any unmatched route |

### The `*` catch-all route

The `path="*"` route renders the `NotFound` component for any path React Router doesn't recognise. This handles client-side 404s — if a user navigates to `/does-not-exist`, React Router matches this route and displays the 404 page rather than crashing.

### Hard refreshes and the server fallback

Because this is a Single Page Application (SPA), React Router only runs **after** the browser has loaded `index.html`. If a user navigates directly to `/about` in the address bar, or hits refresh while on that page, the browser sends a real HTTP request to the server — React Router is not involved at that point.

The Express server handles this with a SPA fallback route that serves `index.html` for any path it doesn't recognise. Once `index.html` loads, React Router boots, reads the current URL, and renders the correct page.

Without that server-side fallback, a hard refresh on any route other than `/` would return a 404 from the server.

## Pages

All page-level components live in `src/pages/`:

| File | Route | Description |
|---|---|---|
| `Home.jsx` | `/` | Home page |
| `About.jsx` | `/about` | About page |
| `NotFound.jsx` | `*` | 404 not found page |

## Scripts

Run from the `client/` directory, or from the project root using the `--prefix client` flag:

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with Hot Module Replacement |
| `npm run build` | Compile and bundle the app
 into `dist/` for production |
| `npm run preview` | Serve the production build locally for testing |
| `npm run lint` | Run ESLint across the project |

> The `dist/` output folder is what the Express server points at with `express.static`. Always rebuild after making client changes before testing through the server.