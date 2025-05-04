import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { SearchResult, TurkishWord } from "@/lib/types";

interface SearchBoxProps {
  onSelectWord?: (word: TurkishWord) => void;
  showTitle?: boolean;
}

export default function SearchBox({ onSelectWord, showTitle = true }: SearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const { data: searchResults, isLoading, error } = useQuery<SearchResult[]>({
    queryKey: [`/api/words/search`, searchQuery],
    enabled: searchQuery.length >= 2,
  });
  
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      {showTitle && (
        <h3 className="font-poppins font-semibold text-lg mb-4">Search Turkish Words</h3>
      )}
      <div className="relative">
        <Input
          type="text"
          placeholder="Type a Turkish or English word..."
          value={searchQuery}
          onChange={handleSearchInput}
          className="w-full border border-gray-medium rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#00A9E0] focus:border-transparent"
        />
        <button 
          className="absolute right-3 top-3 text-gray-600"
          disabled={searchQuery.length < 2}
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
      
      {/* Search Results */}
      {searchQuery.length >= 2 && (
        <div className="mt-4">
          <h4 className="font-poppins font-medium text-sm text-gray-600 mb-2">
            {error ? "Error searching" : isLoading ? "Searching..." : "Search Results:"}
          </h4>
          
          <div className="max-h-64 overflow-y-auto">
            {error ? (
              <p className="text-red-500">Error loading search results</p>
            ) : isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="border-b border-gray-light py-3">
                  <Skeleton className="h-6 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : searchResults && searchResults.length > 0 ? (
              searchResults.map((result) => (
                <div
                  key={result.id}
                  className="border-b border-gray-light py-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleWordSelect(result.id)}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-[#E81C23]">{result.turkish}</p>
                      <p className="text-sm text-dark">{result.english}</p>
                    </div>
                    <div className="text-[#00A9E0]">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-3 text-gray-500">No words found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
