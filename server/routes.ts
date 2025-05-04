import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWordSchema, insertDailyWordSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints
  app.get("/api/word/today", async (req: Request, res: Response) => {
    try {
      const today = new Date();
      const result = await storage.getDailyWord(today);
      
      if (!result) {
        // If no word is set for today, get a random word and set it
        const allWords = await storage.getAllWords();
        
        if (allWords.length === 0) {
          return res.status(404).json({ message: "No words available" });
        }
        
        // Choose a random word
        const randomIndex = Math.floor(Math.random() * allWords.length);
        const randomWord = allWords[randomIndex];
        
        // Create a new daily word
        const newDailyWord = await storage.createDailyWord({
          wordId: randomWord.id,
          date: today
        });
        
        return res.json({ 
          dailyWord: newDailyWord, 
          word: randomWord 
        });
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error getting today's word:", error);
      res.status(500).json({ message: "Failed to get today's word" });
    }
  });

  app.get("/api/word/history", async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 10;
      const history = await storage.getRecentDailyWords(limit);
      res.json(history);
    } catch (error) {
      console.error("Error getting word history:", error);
      res.status(500).json({ message: "Failed to get word history" });
    }
  });

  app.get("/api/words/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.length < 2) {
        return res.status(400).json({ message: "Search query must be at least 2 characters" });
      }
      
      const results = await storage.searchWords(query);
      res.json(results);
    } catch (error) {
      console.error("Error searching words:", error);
      res.status(500).json({ message: "Failed to search words" });
    }
  });

  app.get("/api/words", async (req: Request, res: Response) => {
    try {
      const words = await storage.getAllWords();
      res.json(words);
    } catch (error) {
      console.error("Error getting all words:", error);
      res.status(500).json({ message: "Failed to get all words" });
    }
  });

  app.get("/api/word/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid word ID" });
      }
      
      const word = await storage.getWord(id);
      
      if (!word) {
        return res.status(404).json({ message: "Word not found" });
      }
      
      res.json(word);
    } catch (error) {
      console.error("Error getting word:", error);
      res.status(500).json({ message: "Failed to get word" });
    }
  });

  app.post("/api/word", async (req: Request, res: Response) => {
    try {
      const validatedData = insertWordSchema.parse(req.body);
      const word = await storage.createWord(validatedData);
      res.status(201).json(word);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating word:", error);
      res.status(500).json({ message: "Failed to create word" });
    }
  });

  app.post("/api/word/daily", async (req: Request, res: Response) => {
    try {
      const validatedData = insertDailyWordSchema.parse(req.body);
      
      // Check if the word exists
      const word = await storage.getWord(validatedData.wordId);
      if (!word) {
        return res.status(404).json({ message: "Word not found" });
      }
      
      // Check if there's already a word for this date
      const existingDailyWord = await storage.getDailyWord(validatedData.date);
      if (existingDailyWord) {
        return res.status(409).json({ message: "A word is already set for this date" });
      }
      
      const dailyWord = await storage.createDailyWord(validatedData);
      res.status(201).json({ dailyWord, word });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating daily word:", error);
      res.status(500).json({ message: "Failed to create daily word" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
