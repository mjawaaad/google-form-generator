import { InferModel } from "drizzle-orm";
import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { formDetailsTable } from "./formDetailsSchema";
import { UsersTable } from "./adminSchema";

export const ResponsesTable = pgTable("user_responses", {
  id: serial("id").primaryKey().notNull(),
  email: varchar("user_email").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  formId: integer("form_id")
    .references(() => formDetailsTable.id)
    .notNull(),
  adminEmail: varchar("admin_email").references(() => UsersTable.email),
});

export type Response = InferModel<typeof ResponsesTable>;
export type NewResponse = InferModel<typeof ResponsesTable, "insert">;
