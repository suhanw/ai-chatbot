import { Application } from "express";

export class HealthCheck {
  constructor(app: Application) {
    app.get("/health", (_, res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.send("ok");
    });
  }
}
