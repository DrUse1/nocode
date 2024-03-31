import { eq, relations } from "drizzle-orm";
import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { db } from ".";

export const users = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  forget: text("forget").notNull().default(""),
  isAdmin: boolean("isAdmin").notNull().default(false),
});

export const datasets = pgTable("datasets", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  s3fileId: text("s3fileId").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  datasets: many(datasets),
}));

export const datasetsRelations = relations(datasets, ({ one }) => ({
  userId: one(users, { fields: [datasets.userId], references: [users.id] }),
}));
