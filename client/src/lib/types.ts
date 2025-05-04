// Extended type definitions for frontend components

export interface WordOfTheDay {
  dailyWord: {
    id: number;
    wordId: number;
    date: string;
    createdAt: string;
  };
  word: {
    id: number;
    turkish: string;
    english: string;
    pronunciation: string;
    partOfSpeech: string;
    exampleTurkish1: string;
    exampleEnglish1: string;
    exampleTurkish2: string;
    exampleEnglish2: string;
    notes: string;
    audioUrl: string | null;
  };
}

export interface WordHistoryItem {
  dailyWord: {
    id: number;
    wordId: number;
    date: string;
    createdAt: string;
  };
  word: {
    id: number;
    turkish: string;
    english: string;
  };
}

export interface SearchResult {
  id: number;
  turkish: string;
  english: string;
  pronunciation: string;
  partOfSpeech: string;
}

export interface TurkishWord {
  id: number;
  turkish: string;
  english: string;
  pronunciation: string;
  partOfSpeech: string;
  exampleTurkish1: string;
  exampleEnglish1: string;
  exampleTurkish2: string;
  exampleEnglish2: string;
  notes: string;
  audioUrl: string | null;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}
