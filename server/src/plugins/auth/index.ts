import {
  Router,
  type Application,
  type ErrorRequestHandler,
  type RequestHandler,
} from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";

import { UserRepo, type IUserRepo } from "@data";
import { redisClient } from "@cache";
import { hashFunction, matchPassword } from "./helpers";

declare module "express-session" {
  interface SessionData {
    user: {
      id: string;
      email: string;
    };
  }
}

const userRepo: IUserRepo = new UserRepo();

let store = new RedisStore({
  client: redisClient,
  prefix: "session:",
  ttl: 1000 * 60 * 60 * 24,
});

const cookieOptions = {
  signed: true,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24,
  path: "/",
  sameSite: "lax" as const,
};

export class Auth {
  constructor(app: Application) {
    app.use(
      session({
        store,
        secret: process.env.COOKIE_SECRET!,
        resave: false, // https://github.com/expressjs/session?tab=readme-ov-file#resave
        saveUninitialized: false, // https://github.com/expressjs/session?tab=readme-ov-file#saveuninitialized
        cookie: cookieOptions,
      })
    );

    if (process.env.NODE_ENV === "production") {
      // https://stackoverflow.com/a/75418142
      app.set("trust proxy", 1);
    }

    const router = Router();
    router.post("/signup", this.signup);
    router.post("/login", this.login);
    router.delete("/logout", this.logout);
    router.get("/current_user", this.getCurrentUser);
    router.use(this.handleError);

    app.use("/api/auth", router);

    console.log("Auth plugin registered");
  }

  signup: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      let user = await userRepo.findByEmail(email);
      if (user) {
        throw { status: 422, message: "Email already used." };
      }

      const { hashedPassword, salt } = await hashFunction(password);
      user = await userRepo.create({ email, hashedPassword, salt });

      req.session.user = { id: user._id!, email: user.email };
      res.json({ data: req.session.user });
    } catch (err) {
      next(err);
    }
  };

  login: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await userRepo.findByEmail(email);
      if (!user) {
        throw { status: 401, message: "Incorrect email or password." };
      }

      if (!(await matchPassword(password, user.hashedPassword, user.salt))) {
        throw { status: 401, message: "Incorrect email or password." };
      }

      req.session.user = { id: user._id!, email: user.email };
      res.json({ data: req.session.user });
    } catch (err) {
      next(err);
    }
  };

  logout: RequestHandler = (req, res) => {
    req.session.destroy(console.error);
    res.sendStatus(204);
  };

  getCurrentUser: RequestHandler = (req, res) => {
    res.json({ data: req.session.user || null });
  };

  handleError: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    console.log("Destroying session");
    req.session.destroy(console.error);
    res.status(err.status || 500).send(err.message);
  };
}
