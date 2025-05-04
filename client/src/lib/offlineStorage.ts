import { TurkishWord, WordOfTheDay, WordHistoryItem } from './types';

// Keys for storing data in localStorage
const STORAGE_KEYS = {
  TODAY_WORD: 'turkish_word_today',
  WORD_HISTORY: 'turkish_word_history',
  SEARCHED_WORDS: 'turkish_searched_words'
};

// Maximum number of words to store
const MAX_STORED_WORDS = 50;
const MAX_HISTORY_WORDS = 20;

// Store today's word in localStorage
export function storeTodayWord(wordData: WordOfTheDay): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TODAY_WORD, JSON.stringify(wordData));
  } catch (error) {
    console.error('Failed to store today\'s word:', error);
  }
}

// Get today's word from localStorage
export function getTodayWord(): WordOfTheDay | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TODAY_WORD);
    if (!data) return null;
    return JSON.parse(data) as WordOfTheDay;
  } catch (error) {
    console.error('Failed to get today\'s word from storage:', error);
    return null;
  }
}

// Store word history in localStorage
export function storeWordHistory(words: WordHistoryItem[]): void {
  try {
    // Limit the number of stored history words
    const limitedWords = words.slice(0, MAX_HISTORY_WORDS);
    localStorage.setItem(STORAGE_KEYS.WORD_HISTORY, JSON.stringify(limitedWords));
  } catch (error) {
    console.error('Failed to store word history:', error);
  }
}

// Get word history from localStorage
export function getWordHistory(): WordHistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORD_HISTORY);
    if (!data) return [];
    return JSON.parse(data) as WordHistoryItem[];
  } catch (error) {
    console.error('Failed to get word history from storage:', error);
    return [];
  }
}

// Store a searched word in localStorage
export function storeSearchedWord(word: TurkishWord): void {
  try {
    // Get existing words
    const existingData = localStorage.getItem(STORAGE_KEYS.SEARCHED_WORDS);
    const words = existingData ? JSON.parse(existingData) as TurkishWord[] : [];
    
    // Check if word already exists
    const wordExists = words.some(w => w.id === word.id);
    
    if (!wordExists) {
      // Add new word to the beginning of the array
      words.unshift(word);
      
      // Limit the number of stored words
      const limitedWords = words.slice(0, MAX_STORED_WORDS);
      
      localStorage.setItem(STORAGE_KEYS.SEARCHED_WORDS, JSON.stringify(limitedWords));
    }
  } catch (error) {
    console.error('Failed to store searched word:', error);
  }
}

// Get searched words from localStorage
export function getSearchedWords(): TurkishWord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SEARCHED_WORDS);
    if (!data) return [];
    return JSON.parse(data) as TurkishWord[];
  } catch (error) {
    console.error('Failed to get searched words from storage:', error);
    return [];
  }
}

// Get a specific word by ID from localStorage
export function getWordById(id: number): TurkishWord | null {
  try {
    // Check today's word
    const todayWord = getTodayWord();
    if (todayWord && todayWord.word.id === id) {
      return todayWord.word;
    }
    
    // Check searched words
    const searchedWords = getSearchedWords();
    const foundWord = searchedWords.find(word => word.id === id);
    if (foundWord) {
      return foundWord;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get word by ID from storage:', error);
    return null;
  }
}