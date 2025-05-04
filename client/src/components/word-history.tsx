import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "wouter";
import type { WordHistoryItem, TurkishWord } from "@/lib/types";
import { queryClient } from "@/lib/queryClient";

interface WordHistoryProps {
  limit?: number;
  onSelectWord?: (word: TurkishWord) => void;
}

export default function WordHistory({ limit = 5, onSelectWord }: WordHistoryProps) {
  const { toast } = useToast();
  
  const { data: historyData, isLoading, error } = useQuery<WordHistoryItem[]>({
    queryKey: [`/api/word/history?limit=${limit}`],
  });

  const handleWordSelect = async (wordId: number) => {
    try {
      const word = await queryClient.fetchQuery<TurkishWord>({
        queryKey: [`/api/word/${wordId}`],
      });
      
      if (onSelectWord) {
        onSelectWord(word);
      } else {
        toast({
          title: "Word Selected",
          description: `Selected "${word.turkish}" - ${word.english}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch word details",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="bg-[#00A9E0] text-white py-2 px-4">
        <h3 className="font-poppins font-semibold">Previous Words</h3>
      </div>
      <div className="p-4">
        {error ? (
          <p className="text-red-500 py-3">Error loading word history</p>
        ) : isLoading ? (
          Array(limit).fill(0).map((_, i) => (
            <div key={i} className="border-b border-gray-light py-3 last:border-b-0">
              <Skeleton className="h-6 w-3/4 mb-1" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-10" />
              </div>
            </div>
          ))
        ) : historyData && historyData.length > 0 ? (
          historyData.map(({ dailyWord, word }) => (
            <div
              key={dailyWord.id}
              className="border-b border-gray-light py-3 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              onClick={() => handleWordSelect(word.id)}
            >
              <p className="font-medium text-[#E81C23]">{word.turkish}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-dark">{word.english}</p>
                <p className="text-xs text-gray-600">
                  {format(new Date(dailyWord.date), "MMM d")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-3 text-gray-500">No word history available</p>
        )}
        
        <div className="mt-3 text-center">
          <Link href="/history">
            <a className="text-[#00A9E0] hover:text-[#E81C23] text-sm font-medium transition-colors duration-200">
              View All History
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
