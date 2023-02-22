const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");
const fetch = require('node-fetch');
const cors = require('cors');

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const csrfMiddleware = async (req, res, next) => {
  try {
    const response = await fetch('https://lobster-app-gvavo.ondigitalocean.app/api/csrf-token', { credentials: 'include' });
    const { csrfToken } = await response.json();
    req.headers['x-csrf-token'] = csrfToken;

    // Set the Access-Control-Allow-Origin header to the specific origin that is allowed to access the resource
    res.setHeader('Access-Control-Allow-Origin', 'https://youandusclient.vercel.app');

    next();
  } catch (error) {
    next(error);
  }
};


app.prepare().then(() => {
  const server = express();

  // Add CORS middleware to handle cross-origin requests
  server.use(cors({
    origin: true,
    credentials: true,
  }));

  // Add middleware to set CSRF token in headers of each outgoing request
  server.use(csrfMiddleware);

  // Proxy requests to API server
  server.use(
    "/api",
    createProxyMiddleware({
      target: "https://lobster-app-gvavo.ondigitalocean.app",
      changeOrigin: true,
    })
  );

  // Handle all other requests with Next.js
  server.all('https://youandusclient.vercel.app', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch((err) => {
  console.log("Error", err);
});
