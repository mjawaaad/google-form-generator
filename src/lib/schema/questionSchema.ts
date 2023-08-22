import { InferModel } from "drizzle-orm";
import { pgTable, serial, varchar, text, integer } from "drizzle-orm/pg-core";
import { UsersTable } from "./adminSchema";
import { formDetailsTable } from "./formDetailsSchema";

export const QuestionsTable = pgTable("questions", {
  id: serial("id").primaryKey().notNull(),
  adminEmail: varchar("admin_email")
    .references(() => UsersTable.email)
    .notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  options: text("options").array(),
  formId: integer("form_id")
    .references(() => formDetailsTable.id)
    .notNull(),
});

export type Question = InferModel<typeof QuestionsTable>;
export type NewQuestion = InferModel<typeof QuestionsTable, "insert">;
