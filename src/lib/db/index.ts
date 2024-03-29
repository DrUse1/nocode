import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { parseCookies } from "../utils";
import { verify } from "jsonwebtoken";
import { users } from "./schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

// const client = createClient({
//   url: process.env.DB_URL,
//   authToken: process.env.DB_TOKEN,
// });

// export const db = drizzle(client, { schema, logger: false });

const connectionString = process.env.DATABASE_URL;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString);
export const db = drizzle(client, { schema });
// (async () => {
//   // migrate(db, { migrationsFolder: "drizzle" });
//   console.log(await db.select().from(users));
// })();

export async function getUserFromSession(req: Request) {
  const cookie = req.headers.get("cookie");
  if (!cookie) return undefined;
  const session = parseCookies(cookie).session;
  if (!session) return undefined;
  const userID = verify(session, process.env.JWT_SECRET!) as string;

  return await db.query.users.findFirst({
    where: eq(users.id, userID),
    with: { datasets: true },
  });
}
