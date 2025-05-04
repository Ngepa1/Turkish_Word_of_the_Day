import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import type { WordHistoryItem, TurkishWord } from "@/lib/types";
import WordOfTheDay from "@/components/word-of-the-day";

export default function History() {
  const [selectedWord, setSelectedWord] = useState<TurkishWord | null>(null);
  
  const { data: historyData, isLoading, error } = useQuery<WordHistoryItem[]>({
    queryKey: ["/api/word/history?limit=30"],
  });

  const handleWordSelect = async (word: TurkishWord) => {
    setSelectedWord(word);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-3xl font-bold font-poppins mb-6">Word History</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {selectedWord ? (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="font-poppins font-bold text-3xl text-[#E81C23] mb-2">{selectedWord.turkish}</h2>
              <p className="text-gray-600 mb-2">{selectedWord.pronunciation}</p>
              <h3 className="font-poppins text-xl text-dark mb-4">{selectedWord.english}</h3>
              
              <div className="mt-6">
                <h4 className="font-poppins font-semibold text-lg mb-3">Example Sentences:</h4>
                <div className="bg-[#E9ECEF] rounded-lg p-4 mb-4">
                  <p className="font-medium text-[#E81C23] mb-1">{selectedWord.exampleTurkish1}</p>
                  <p className="text-dark">{selectedWord.exampleEnglish1}</p>
                </div>
                <div className="bg-[#E9ECEF] rounded-lg p-4">
                  <p className="font-medium text-[#E81C23] mb-1">{selectedWord.exampleTurkish2}</p>
                  <p className="text-dark">{selectedWord.exampleEnglish2}</p>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-light pt-4">
                <h4 className="font-poppins font-semibold text-lg mb-2">Notes:</h4>
                <p className="text-dark">{selectedWord.notes}</p>
              </div>
            </div>
          ) : (
            <WordOfTheDay />
          )}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-[#00A9E0] text-white py-3 px-4">
              <h3 className="font-poppins font-semibold">Word History</h3>
            </div>
            
            <div className="p-4">
              {error ? (
                <p className="text-red-500 py-3">Error loading word history</p>
              ) : isLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <div key={i} className="border-b border-gray-light py-3 last:border-b-0">
                    <Skeleton className="h-6 w-3/4 mb-1" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))
              ) : historyData && historyData.length > 0 ? (
                historyData.map(({ dailyWord, word }) => (
                  <div
                    key={dailyWord.id}
                    onClick={() => handleWordSelect(word as TurkishWord)}
                    className="border-b border-gray-light py-3 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    <p className="font-medium text-[#E81C23]">{word.turkish}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-dark">{word.english}</p>
                      <p className="text-xs text-gray-600">
                        {format(new Date(dailyWord.date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-3 text-gray-500">No word history available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
