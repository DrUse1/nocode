import Stripe from "stripe";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { eq, or } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const client = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN,
});

export const db = drizzle(client, { schema, logger: true });
