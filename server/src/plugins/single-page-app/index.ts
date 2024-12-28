import { Application } from "express";

async function getBundleCdnUrl() {
  let url = `http://localhost:8080/client.js`;
  try {
    const manifest = await fetch(process.env.CLIENT_MANIFEST_URL!);
    const manifestJson = await manifest.json();
    url = manifestJson["client.js"];
  } catch (error) {
    console.error("Error loading manifest.json: ", {
      CLIENT_MANIFEST_URL: process.env.CLIENT_MANIFEST_URL,
      error,
    });
  }
  return url;
}

export class SinglePageApp {
  constructor(app: Application) {
    app.get("/", async (req, res) => {
      const bundleCdnUrl = await getBundleCdnUrl();
      res.contentType("text/html").send(`
        <!DOCTYPE html>
        <html>
          <head>
            <link rel="icon" href="${process.env.FAVICON_URL}" />
            <title>My Chatbot</title>
            <script>window.isLoggedIn=${Boolean(req.session.user)}</script>
          </head>
          <body>
            <div id="root"></div>
            <script src="${bundleCdnUrl}"></script>
          </body>
        </html>
      `);
    });
  }
}
