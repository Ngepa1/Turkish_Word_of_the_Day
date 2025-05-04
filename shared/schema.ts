import { pgTable, text, serial, integer, boolean, date, timestamp, primaryKey, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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

export const wordsRelations = relations(words, ({ many }) => ({
  dailyWords: many(dailyWords),
}));

export const insertWordSchema = createInsertSchema(words).omit({
  id: true,
});

// Daily words schema to track which word was featured on which date
export const dailyWords = pgTable("daily_words", {
  id: serial("id").primaryKey(),
  wordId: integer("word_id").notNull().references(() => words.id),
  date: date("date").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dailyWordsRelations = relations(dailyWords, ({ one }) => ({
  word: one(words, {
    fields: [dailyWords.wordId],
    references: [words.id],
  }),
}));

export const insertDailyWordSchema = createInsertSchema(dailyWords).omit({
  id: true,
  createdAt: true,
});

// Stories schema for short Turkish reading practice
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEnglish: text("title_english").notNull(),
  difficultyLevel: text("difficulty_level").notNull(), // beginner, intermediate, advanced
  contentTurkish: text("content_turkish").notNull(),
  contentEnglish: text("content_english").notNull(),
  vocabularyWords: text("vocabulary_words").array(), // Array of key Turkish words used in the story
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
});

// Story-Word relations for vocabulary highlighting
export const storyWords = pgTable("story_words", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id").notNull().references(() => stories.id),
  wordId: integer("word_id").notNull().references(() => words.id),
});

export const storyWordsRelations = relations(storyWords, ({ one }) => ({
  story: one(stories, {
    fields: [storyWords.storyId],
    references: [stories.id],
  }),
  word: one(words, {
    fields: [storyWords.wordId],
    references: [words.id],
  }),
}));

export const insertStoryWordsSchema = createInsertSchema(storyWords).omit({
  id: true,
});

// Relations
export const storiesRelations = relations(stories, ({ many }) => ({
  storyWords: many(storyWords),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Word = typeof words.$inferSelect;
export type InsertWord = z.infer<typeof insertWordSchema>;

export type DailyWord = typeof dailyWords.$inferSelect;
export type InsertDailyWord = z.infer<typeof insertDailyWordSchema>;

export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;

export type StoryWord = typeof storyWords.$inferSelect;
export type InsertStoryWord = z.infer<typeof insertStoryWordsSchema>;
