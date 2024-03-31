/// <reference types="@kitajs/html/htmx.d.ts" />
/// <reference lib="dom" />

import { TypeOf, z } from "zod";
import { Router } from "./router";
import { mainRouter } from "./pages/main";
import { BaseHtml } from "./layouts/base";
import Html from "@kitajs/html";
import { authRouter } from "./pages/auth";
import { dashboardRouter } from "./pages/dashboard";

const zodEnv = z.object({
  JWT_SECRET: z.string(),
  STRIPE_PUBLIC_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  DB_URL: z.string(),
  DB_TOKEN: z.string(),
  LEMON_KEY: z.string(),
  DATABASE_URL: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof zodEnv> {}
  }
  var interval: Timer | null;
}

const app = new Router()
  // .cron(5000, () => console.log(Bun.gc(true)))
  .use(authRouter)
  .use(mainRouter)
  .use(dashboardRouter)
  .listen(3000, 2000);

console.log(
  `🦊 Server is running at http://${app.server?.hostname}:${app.server?.port}`,
);
