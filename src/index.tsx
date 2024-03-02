/// <reference types="@kitajs/html/htmx.d.ts" />
/// <reference lib="dom" />

import { TypeOf, z } from "zod";
import { Router } from "./router";
import { mainRouter } from "./pages/main";

const zodEnv = z.object({
  JWT_SECRET: z.string(),
  STRIPE_PUBLIC_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  DB_URL: z.string(),
  DB_TOKEN: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof zodEnv> {}
  }
}

export async function htmlResponse(
  body: string | Promise<string>,
  options?: ResponseInit | undefined,
) {
  return new Response(await body, {
    headers: {
      "Content-Type": "text/html",
    },
    ...options,
  });
}

export function parseCookies(str: string) {
  let splitted = str.split("; ");
  const result: Record<string, string> = {};
  for (let i in splitted) {
    const cur = splitted[i].split("=");
    result[cur[0]] = cur[1];
  }
  return result;
}

const app = new Router().use(mainRouter).listen(3000, 2000);

console.log(
  `🦊 Server is running at http://${app.server?.hostname}:${app.server?.port}`,
);
