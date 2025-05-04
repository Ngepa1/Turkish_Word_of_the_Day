import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Turkish words schema
export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  turkish: text("turkish").notNull().unique(),
  english: text("english").notNull(),
  pronunciation: text("pronunciation").notNull(),
  partOfSpeech: text("part_of_speech").notNull(),
  exampleTurkish1: text("example_turkish_1").notNull(),
  exampleEnglish1: text("example_english_1").notNull(),
  exampleTurkish2: text("example_turkish_2").notNull(),
  exampleEnglish2: text("example_english_2").notNull(),
  notes: text("notes").notNull(),
  audioUrl: text("audio_url"), // Optional audio URL
});

export const insertWordSchema = createInsertSchema(words).omit({
  id: true,
});

// Daily words schema to track which word was featured on which date
export const dailyWords = pgTable("daily_words", {
  id: serial("id").primaryKey(),
  wordId: integer("word_id").notNull(),
  date: date("date").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDailyWordSchema = createInsertSchema(dailyWords).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Word = typeof words.$inferSelect;
export type InsertWord = z.infer<typeof insertWordSchema>;

export type DailyWord = typeof dailyWords.$inferSelect;
export type InsertDailyWord = z.infer<typeof insertDailyWordSchema>;
