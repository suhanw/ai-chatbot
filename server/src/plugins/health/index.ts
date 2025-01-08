import { Application } from "express";

export class HealthCheck {
  constructor(app: Application) {
    app.get("/health", (_, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send("ok");
    });
  }
}
