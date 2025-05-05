import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { getWordHistory, getSearchedWords } from "@/lib/offlineStorage";
import { Lightbulb, BookOpen, Star } from "lucide-react";

export default function LearningProgress() {
  // Initial progress values
  const [wordsSeen, setWordsSeen] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [progressLevel, setProgressLevel] = useState(1);
  const [progressTitle, setProgressTitle] = useState("Beginner");
  
  // Define the level thresholds (number of words needed for each level)
  const levels = [
    { threshold: 0, title: "Beginner", color: "bg-blue-500" },
    { threshold: 5, title: "Novice", color: "bg-green-500" },
    { threshold: 10, title: "Intermediate", color: "bg-yellow-500" },
    { threshold: 20, title: "Advanced", color: "bg-orange-500" },
    { threshold: 30, title: "Expert", color: "bg-red-500" },
    { threshold: 50, title: "Master", color: "bg-purple-500" },
  ];
  
  // Calculate words learned and current level
  useEffect(() => {
    // Get unique words from history and searches
    const historyWords = getWordHistory();
    const searchedWords = getSearchedWords();
    
    // Create a Set of unique word IDs
    const uniqueWordIds = new Set();
    historyWords.forEach(item => uniqueWordIds.add(item.word.id));
    searchedWords.forEach(word => uniqueWordIds.add(word.id));
    
    // Count of unique words seen
    const wordsCount = uniqueWordIds.size;
    setWordsSeen(wordsCount);
    
    // Determine current level
    let currentLevel = 0;
    for (let i = 0; i < levels.length; i++) {
      if (wordsCount >= levels[i].threshold) {
        currentLevel = i;
      } else {
        break;
      }
    }
    
    // Set current level info
    setProgressLevel(currentLevel + 1);
    setProgressTitle(levels[currentLevel].title);
    
    // Calculate progress percentage to next level
    const currentThreshold = levels[currentLevel].threshold;
    const nextLevel = currentLevel + 1 < levels.length ? currentLevel + 1 : currentLevel;
    const nextThreshold = levels[nextLevel].threshold;
    
    const range = nextThreshold - currentThreshold;
    const position = wordsCount - currentThreshold;
    
    // Calculate percentage (if at max level, show 100%)
    const percentage = currentLevel + 1 >= levels.length 
      ? 100 
      : Math.min(Math.round((position / range) * 100), 100);
    
    setProgressValue(percentage);
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-poppins font-bold text-lg text-[#1a365d] flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-[#E81C23]" />
          Learning Progress
        </h3>
        <div className="text-sm font-medium text-gray-600">
          Level {progressLevel}: {progressTitle}
        </div>
      </div>
      
      <div className="mb-4">
        <Progress value={progressValue} className="h-3" />
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center">
          <BookOpen className="mr-1 h-4 w-4 text-[#00A9E0]" />
          <span>{wordsSeen} words learned</span>
        </div>
        
        <div className="flex items-center">
          <Star className="mr-1 h-4 w-4 text-[#F5B335]" />
          <span>
            {progressValue}% to {
              progressLevel < levels.length ? `Level ${progressLevel + 1}` : "Mastery"
            }
          </span>
        </div>
      </div>
    </div>
  );
}