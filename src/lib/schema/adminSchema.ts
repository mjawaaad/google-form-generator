import { InferModel } from "drizzle-orm";
import { pgTable, serial, varchar, uniqueIndex } from "drizzle-orm/pg-core";

export const UsersTable = pgTable(
  "admins",
  {
    id: serial("id").primaryKey().notNull(),
    fullName: varchar("full_name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    password: varchar("password", { length: 256 }).notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);

export type User = InferModel<typeof UsersTable>;
export type NewUser = InferModel<typeof UsersTable, "insert">;
