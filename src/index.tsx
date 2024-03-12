/// <reference types="@kitajs/html/htmx.d.ts" />
/// <reference lib="dom" />

import { TypeOf, z } from "zod";
import { Router } from "./router";
import { mainRouter } from "./pages/main";
import { BaseHtml } from "./layouts/base";
import Html from "@kitajs/html";

const zodEnv = z.object({
  JWT_SECRET: z.string(),
  STRIPE_PUBLIC_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  DB_URL: z.string(),
  DB_TOKEN: z.string(),
});

const app = new Router()
  // .cron(1000, () => console.log("Hello"))
  .use(mainRouter)
  .listen(3000, 2000);

console.log(
  `🦊 Server is running at http://${app.server?.hostname}:${app.server?.port}`,
);
