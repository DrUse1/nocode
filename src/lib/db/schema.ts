import { relations } from "drizzle-orm";
import {
  foreignKey,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  forget: text("forget").notNull().default(""),
  isAdmin: integer("isAdmin", { mode: "boolean" }).notNull().default(false),
});

export const datasets = sqliteTable("datasets", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
});

export const usersRelations = relations(users, ({ many }) => ({
  datasets: many(datasets),
}));

export const datasetsRelations = relations(datasets, ({ one }) => ({
  userId: one(users, { fields: [datasets.userId], references: [users.id] }),
}));
