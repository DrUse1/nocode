import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  forget: text("forget").notNull().default(""),
  isAdmin: integer("isAdmin", { mode: "boolean" }).notNull().default(false),
});
