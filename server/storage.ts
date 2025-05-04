import { 
  users, 
  words, 
  dailyWords,
  stories,
  storyWords,
  type User, 
  type InsertUser,
  type Word,
  type InsertWord,
  type DailyWord,
  type InsertDailyWord,
  type Story,
  type InsertStory,
  type StoryWord,
  type InsertStoryWord
} from "@shared/schema";
import { db } from "./db";
import { eq, like, desc, asc, sql } from "drizzle-orm";

// Modified storage interface with CRUD methods for our application
export interface IStorage {
  // User methods (keeping from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Word methods
  getWord(id: number): Promise<Word | undefined>;
  getAllWords(): Promise<Word[]>;
  searchWords(query: string): Promise<Word[]>;
  createWord(word: InsertWord): Promise<Word>;
  
  // Daily word methods
  getDailyWord(date: Date): Promise<{ dailyWord: DailyWord, word: Word } | undefined>;
  getRecentDailyWords(limit: number): Promise<{ dailyWord: DailyWord, word: Word }[]>;
  createDailyWord(dailyWord: InsertDailyWord): Promise<DailyWord>;

  // Story methods
  getStory(id: number): Promise<Story | undefined>;
  getAllStories(): Promise<Story[]>;
  getStoriesByDifficulty(level: string): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  
  // Story-Word relations methods
  getStoryWords(storyId: number): Promise<{ storyWord: StoryWord, word: Word }[]>;
  addWordToStory(storyWord: InsertStoryWord): Promise<StoryWord>;

  // New method for database implementation
  seedInitialData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Word methods
  async getWord(id: number): Promise<Word | undefined> {
    const [word] = await db.select().from(words).where(eq(words.id, id));
    return word;
  }

  async getAllWords(): Promise<Word[]> {
    return await db.select().from(words);
  }

  async searchWords(query: string): Promise<Word[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    return await db.select().from(words).where(
      sql`lower(${words.turkish}) like ${lowerQuery} or lower(${words.english}) like ${lowerQuery}`
    );
  }

  async createWord(insertWord: InsertWord): Promise<Word> {
    const [word] = await db.insert(words).values(insertWord).returning();
    return word;
  }

  // Daily word methods
  async getDailyWord(date: Date): Promise<{ dailyWord: DailyWord, word: Word } | undefined> {
    const dateString = date.toISOString().split('T')[0];
    
    // First find the daily word for this date
    const [dailyWord] = await db.select()
      .from(dailyWords)
      .where(sql`date(${dailyWords.date}) = date(${dateString})`);
    
    if (!dailyWord) {
      return undefined;
    }
    
    // Then find the word
    const [word] = await db.select()
      .from(words)
      .where(eq(words.id, dailyWord.wordId));
    
    if (!word) {
      return undefined;
    }
    
    return { dailyWord, word };
  }

  async getRecentDailyWords(limit: number): Promise<{ dailyWord: DailyWord, word: Word }[]> {
    // Get the daily words sorted by date
    const dailyWordsResult = await db.select()
      .from(dailyWords)
      .orderBy(desc(dailyWords.date))
      .limit(limit);
    
    // For each daily word, fetch the associated Turkish word
    const result: { dailyWord: DailyWord, word: Word }[] = [];
    
    for (const dw of dailyWordsResult) {
      const [word] = await db.select()
        .from(words)
        .where(eq(words.id, dw.wordId));
      
      if (word) {
        result.push({ dailyWord: dw, word });
      }
    }
    
    return result;
  }

  async createDailyWord(insertDailyWord: InsertDailyWord): Promise<DailyWord> {
    const [dailyWord] = await db.insert(dailyWords)
      .values(insertDailyWord)
      .returning();
    
    return dailyWord;
  }

  // Story methods
  async getStory(id: number): Promise<Story | undefined> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    return story;
  }

  async getAllStories(): Promise<Story[]> {
    return await db.select().from(stories);
  }

  async getStoriesByDifficulty(level: string): Promise<Story[]> {
    return await db.select().from(stories).where(eq(stories.difficultyLevel, level));
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const [story] = await db.insert(stories).values(insertStory).returning();
    return story;
  }

  // Story-Word relations methods
  async getStoryWords(storyId: number): Promise<{ storyWord: StoryWord, word: Word }[]> {
    const storyWordsResult = await db.select()
      .from(storyWords)
      .where(eq(storyWords.storyId, storyId));

    const result: { storyWord: StoryWord, word: Word }[] = [];
    
    for (const sw of storyWordsResult) {
      const [word] = await db.select()
        .from(words)
        .where(eq(words.id, sw.wordId));
      
      if (word) {
        result.push({ storyWord: sw, word });
      }
    }
    
    return result;
  }

  async addWordToStory(insertStoryWord: InsertStoryWord): Promise<StoryWord> {
    const [storyWord] = await db.insert(storyWords)
      .values(insertStoryWord)
      .returning();
    
    return storyWord;
  }

  // Seed initial data if the database is empty
  async seedInitialData(): Promise<void> {
    // Check if we already have words
    const existingWords = await this.getAllWords();
    
    if (existingWords.length === 0) {
      console.log('Seeding initial Turkish words...');
      // Seed the initial Turkish words
      const initialWords: InsertWord[] = [
        {
          turkish: "Merhaba",
          english: "Hello",
          pronunciation: "/mer-ha-ba/",
          partOfSpeech: "greeting",
          exampleTurkish1: "Merhaba, benim adım Ali.",
          exampleEnglish1: "Hello, my name is Ali.",
          exampleTurkish2: "Merhaba, nasılsın?",
          exampleEnglish2: "Hello, how are you?",
          notes: "Merhaba is the most common greeting in Turkish, used throughout the day. It comes from the Arabic word 'marhaba' which means 'welcome' or 'hello'.",
          audioUrl: null
        },
        {
          turkish: "Teşekkür ederim",
          english: "Thank you",
          pronunciation: "/teh-shek-kur ed-er-im/",
          partOfSpeech: "phrase",
          exampleTurkish1: "Yardımınız için teşekkür ederim.",
          exampleEnglish1: "Thank you for your help.",
          exampleTurkish2: "Hediye için teşekkür ederim.",
          exampleEnglish2: "Thank you for the gift.",
          notes: "Teşekkür ederim is the formal way to say thank you in Turkish. 'Teşekkürler' is a more casual way to say thanks.",
          audioUrl: null
        },
        {
          turkish: "Lütfen",
          english: "Please",
          pronunciation: "/lut-fen/",
          partOfSpeech: "adverb",
          exampleTurkish1: "Lütfen bana yardım eder misin?",
          exampleEnglish1: "Could you please help me?",
          exampleTurkish2: "Su, lütfen.",
          exampleEnglish2: "Water, please.",
          notes: "Lütfen is used to make polite requests in Turkish. It can be placed at the beginning or end of a sentence.",
          audioUrl: null
        },
        {
          turkish: "Güle güle",
          english: "Goodbye",
          pronunciation: "/goo-leh goo-leh/",
          partOfSpeech: "phrase",
          exampleTurkish1: "Güle güle, yarın görüşürüz.",
          exampleEnglish1: "Goodbye, see you tomorrow.",
          exampleTurkish2: "Şimdi gitmeliyim, güle güle!",
          exampleEnglish2: "I have to go now, goodbye!",
          notes: "Güle güle literally means 'smilingly' and is said to the person who is leaving. The person who stays says 'Güle güle', while the person who is leaving says 'Hoşça kal'.",
          audioUrl: null
        },
        {
          turkish: "Hoşgeldiniz",
          english: "Welcome",
          pronunciation: "/hosh-gel-din-iz/",
          partOfSpeech: "phrase",
          exampleTurkish1: "Evimize hoşgeldiniz!",
          exampleEnglish1: "Welcome to our home!",
          exampleTurkish2: "Türkiye'ye hoşgeldiniz.",
          exampleEnglish2: "Welcome to Turkey.",
          notes: "Hoşgeldiniz is the formal plural form of welcome. 'Hoşgeldin' is the informal singular form. The response is typically 'Hoşbulduk' (We are pleased to be here).",
          audioUrl: null
        },
        {
          turkish: "Nasılsın",
          english: "How are you",
          pronunciation: "/na-sil-sin/",
          partOfSpeech: "question",
          exampleTurkish1: "Merhaba, nasılsın?",
          exampleEnglish1: "Hello, how are you?",
          exampleTurkish2: "Uzun zamandır görüşmüyoruz, nasılsın?",
          exampleEnglish2: "We haven't seen each other for a long time, how are you?",
          notes: "Nasılsın is the informal singular form. For formal or plural, use 'Nasılsınız'. Common responses include 'İyiyim' (I'm good) or 'Çok iyiyim, teşekkür ederim' (I'm very good, thank you).",
          audioUrl: null
        },
        {
          turkish: "Kitap",
          english: "Book",
          pronunciation: "/ki-tap/",
          partOfSpeech: "noun",
          exampleTurkish1: "Bu kitap çok ilginç.",
          exampleEnglish1: "This book is very interesting.",
          exampleTurkish2: "Kitap okumayı seviyorum.",
          exampleEnglish2: "I like reading books.",
          notes: "Kitap is a common noun in Turkish. The plural form is 'kitaplar'. It comes from the Arabic word 'kitab'.",
          audioUrl: null
        },
        {
          turkish: "Su",
          english: "Water",
          pronunciation: "/soo/",
          partOfSpeech: "noun",
          exampleTurkish1: "Bir bardak su içtim.",
          exampleEnglish1: "I drank a glass of water.",
          exampleTurkish2: "Su içmek sağlıklıdır.",
          exampleEnglish2: "Drinking water is healthy.",
          notes: "Su is one of the most basic and common words in Turkish. It is an irregular noun that doesn't follow the standard rules when adding suffixes.",
          audioUrl: null
        },
        {
          turkish: "Evet",
          english: "Yes",
          pronunciation: "/ev-et/",
          partOfSpeech: "adverb",
          exampleTurkish1: "Türk müsün? Evet.",
          exampleEnglish1: "Are you Turkish? Yes.",
          exampleTurkish2: "Evet, ben de aynı fikirdeyim.",
          exampleEnglish2: "Yes, I agree.",
          notes: "Evet is the standard word for 'yes' in Turkish. It can be accompanied by nodding your head.",
          audioUrl: null
        },
        {
          turkish: "Hayır",
          english: "No",
          pronunciation: "/ha-yir/",
          partOfSpeech: "adverb",
          exampleTurkish1: "Hayır, teşekkürler.",
          exampleEnglish1: "No, thank you.",
          exampleTurkish2: "Hayır, ben Türk değilim.",
          exampleEnglish2: "No, I am not Turkish.",
          notes: "Hayır is the standard word for 'no' in Turkish. A shorter, less formal version is 'yok'.",
          audioUrl: null
        }
      ];

      // Insert the words one by one
      for (const word of initialWords) {
        await this.createWord(word);
      }

      console.log('Seeding daily words...');
      // Get all the words we just created
      const allWords = await this.getAllWords();
      
      // Create daily words for the last 10 days (or as many as we have words)
      const today = new Date();
      for (let i = 0; i < Math.min(10, allWords.length); i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        const wordId = allWords[i].id;
        
        await this.createDailyWord({
          wordId,
          date: date.toISOString().split('T')[0]
        });
      }
      
      // Check if we have stories
      const existingStories = await this.getAllStories();
      
      if (existingStories.length === 0) {
        console.log('Seeding initial stories...');
        // Seed initial stories
        const initialStories: InsertStory[] = [
          {
            title: "Kahvaltı",
            titleEnglish: "Breakfast",
            difficultyLevel: "beginner",
            contentTurkish: "Ali her sabah erken kalkar. Saat yedide kahvaltı yapar. Kahvaltıda çay içer ve ekmek yer. Bazen peynir ve zeytin de yer. Kahvaltıdan sonra işe gider. Ali kahvaltıyı çok sever.",
            contentEnglish: "Ali wakes up early every morning. He has breakfast at seven o'clock. At breakfast, he drinks tea and eats bread. Sometimes he also eats cheese and olives. After breakfast, he goes to work. Ali loves breakfast very much.",
            vocabularyWords: ["kahvaltı", "sabah", "erken", "çay", "ekmek", "peynir", "zeytin"]
          },
          {
            title: "Pazar Günü",
            titleEnglish: "Sunday",
            difficultyLevel: "beginner",
            contentTurkish: "Bugün pazar. Ayşe pazar günlerini çok sever. Çünkü okul yok. Ayşe geç uyanır ve ailesine kahvaltı hazırlar. Öğleden sonra arkadaşlarıyla parkta buluşur. Hep beraber dondurma yerler ve oyun oynarlar. Akşam ise ailesiyle film izler. Ayşe için pazar günleri çok güzel geçer.",
            contentEnglish: "Today is Sunday. Ayşe loves Sundays very much because there is no school. Ayşe wakes up late and prepares breakfast for her family. In the afternoon, she meets her friends at the park. They all eat ice cream together and play games. In the evening, she watches a movie with her family. For Ayşe, Sundays are very enjoyable.",
            vocabularyWords: ["pazar", "günü", "okul", "aile", "kahvaltı", "arkadaş", "park", "dondurma", "film"]
          }
        ];
        
        // Insert the stories one by one
        for (const story of initialStories) {
          await this.createStory(story);
        }
        
        // Link some vocabulary words to stories
        const allStories = await this.getAllStories();
        
        if (allStories.length > 0) {
          const vocabWords = await this.searchWords("kitap");
          
          if (vocabWords.length > 0) {
            await this.addWordToStory({
              storyId: allStories[0].id,
              wordId: vocabWords[0].id
            });
          }
        }
      }
      
      console.log('Database seeding complete!');
    }
  }
}

export const storage = new DatabaseStorage();
