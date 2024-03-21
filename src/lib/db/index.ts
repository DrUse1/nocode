import Stripe from "stripe";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { parseCookies } from "../utils";
import { verify } from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const client = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN,
});

export const db = drizzle(client, { schema, logger: false });

export function getSession(req: Request) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return undefined;
  const session = parseCookies(cookie).session;
  if (!session) return undefined;
  const userID = verify(session, process.env.JWT_SECRET!) as string;
  return userID;
}
