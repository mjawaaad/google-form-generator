import { InferModel } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  numeric,
  integer,
} from "drizzle-orm/pg-core";

export const formDetailsTable = pgTable("form_details", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }).notNull(),
});

export type formDetails = InferModel<typeof formDetailsTable>;
export type NewFormDetails = InferModel<typeof formDetailsTable, "insert">;
