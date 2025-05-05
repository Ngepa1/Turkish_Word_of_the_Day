import { TurkishWord } from "./types";

// Define spaced repetition levels and intervals
export const REPETITION_LEVELS = {
  NEW: 0,
  LEVEL_1: 1,       // Review after 1 day
  LEVEL_2: 2,       // Review after 3 days
  LEVEL_3: 3,       // Review after 7 days
  LEVEL_4: 4,       // Review after 14 days
  LEVEL_5: 5,       // Review after 30 days
  MASTERED: 6,      // Mastered, review rarely
};

// Define days between reviews for each level
export const REVIEW_INTERVALS = {
  [REPETITION_LEVELS.NEW]: 0,
  [REPETITION_LEVELS.LEVEL_1]: 1,
  [REPETITION_LEVELS.LEVEL_2]: 3,
  [REPETITION_LEVELS.LEVEL_3]: 7,
  [REPETITION_LEVELS.LEVEL_4]: 14,
  [REPETITION_LEVELS.LEVEL_5]: 30,
  [REPETITION_LEVELS.MASTERED]: 60,
};

// Flashcard interface for a word with its spaced repetition data
export interface FlashcardItem {
  word: TurkishWord;
  level: number;
  nextReviewDate: string; // ISO date string
  lastReviewDate: string | null; // ISO date string
}

// Key for storing flashcards in localStorage
const FLASHCARDS_STORAGE_KEY = 'turkishWords_flashcards';

// Initialize flashcards if not already in localStorage
const initializeFlashcards = (): FlashcardItem[] => {
  const stored = localStorage.getItem(FLASHCARDS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

// Get all flashcards
export const getAllFlashcards = (): FlashcardItem[] => {
  return initializeFlashcards();
};

// Add a word to the flashcard collection
export const addWordToFlashcards = (word: TurkishWord): void => {
  const flashcards = getAllFlashcards();
  
  // Check if the word already exists
  const existingIndex = flashcards.findIndex(fc => fc.word.id === word.id);
  
  if (existingIndex === -1) {
    // Add as a new word
    const today = new Date().toISOString();
    const newFlashcard: FlashcardItem = {
      word,
      level: REPETITION_LEVELS.NEW,
      nextReviewDate: today, // Due immediately
      lastReviewDate: null,
    };
    
    flashcards.push(newFlashcard);
    localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(flashcards));
  }
};

// Update a flashcard after review
export const updateFlashcard = (wordId: number, wasCorrect: boolean): void => {
  const flashcards = getAllFlashcards();
  const index = flashcards.findIndex(fc => fc.word.id === wordId);
  
  if (index !== -1) {
    const today = new Date();
    const flashcard = flashcards[index];
    
    // Update level based on correctness
    if (wasCorrect) {
      // Move up a level if correct (max at MASTERED)
      flashcard.level = Math.min(flashcard.level + 1, REPETITION_LEVELS.MASTERED);
    } else {
      // Move down a level if incorrect (min at NEW)
      flashcard.level = Math.max(flashcard.level - 1, REPETITION_LEVELS.NEW);
    }
    
    // Set last review date to today
    flashcard.lastReviewDate = today.toISOString();
    
    // Calculate next review date based on new level
    const nextReviewDays = REVIEW_INTERVALS[flashcard.level];
    const nextReviewDate = new Date(today);
    nextReviewDate.setDate(today.getDate() + nextReviewDays);
    flashcard.nextReviewDate = nextReviewDate.toISOString();
    
    // Save updated flashcards
    flashcards[index] = flashcard;
    localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(flashcards));
  }
};

// Get flashcards due for review today
export const getDueFlashcards = (): FlashcardItem[] => {
  const flashcards = getAllFlashcards();
  const today = new Date().toISOString();
  
  return flashcards.filter(fc => fc.nextReviewDate <= today);
};

// Get flashcard by word ID
export const getFlashcardById = (wordId: number): FlashcardItem | undefined => {
  const flashcards = getAllFlashcards();
  return flashcards.find(fc => fc.word.id === wordId);
};

// Remove a flashcard
export const removeFlashcard = (wordId: number): void => {
  const flashcards = getAllFlashcards();
  const newFlashcards = flashcards.filter(fc => fc.word.id !== wordId);
  localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(newFlashcards));
};

// Reset a flashcard to level 0
export const resetFlashcard = (wordId: number): void => {
  const flashcards = getAllFlashcards();
  const index = flashcards.findIndex(fc => fc.word.id === wordId);
  
  if (index !== -1) {
    const today = new Date().toISOString();
    flashcards[index].level = REPETITION_LEVELS.NEW;
    flashcards[index].nextReviewDate = today;
    flashcards[index].lastReviewDate = null;
    
    localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(flashcards));
  }
};