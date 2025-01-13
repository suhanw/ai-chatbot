import express from "express";
import { connectDB } from "@data";
import { Auth } from "./plugins/auth";
import { Conversations } from "./plugins/conversations";
import { SinglePageApp } from "./plugins/single-page-app";
import { HealthCheck } from "./plugins/health";

connectDB();

const app = express();

app.use(express.json());

new Auth(app);
new Conversations(app);
new SinglePageApp(app);
new HealthCheck(app);

const server = app.listen(process.env.PORT);
server.on("listening", () => {
  console.log("NODE_ENV", process.env.NODE_ENV);
  console.log("Server running on", server.address());
});
