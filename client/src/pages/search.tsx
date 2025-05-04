import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import type { TurkishWord, SearchResult } from "@/lib/types";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWord, setSelectedWord] = useState<TurkishWord | null>(null);
  
  const { data: searchResults, isLoading, error } = useQuery<SearchResult[]>({
    queryKey: [`/api/words/search`, searchQuery],
    enabled: searchQuery.length >= 2,
  });
  
  const { data: wordDetails, isLoading: isLoadingDetails } = useQuery<TurkishWord>({
    queryKey: [`/api/word/${selectedWord?.id}`],
    enabled: !!selectedWord,
  });
  
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The query is already being executed by the useQuery hook
  };
  
  const handleWordSelect = (wordId: number) => {
    const selectedWord = searchResults?.find(word => word.id === wordId);
    if (selectedWord) {
      setSelectedWord(selectedWord as TurkishWord);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-3xl font-bold font-poppins mb-6">Search Turkish Words</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <form onSubmit={handleSearchSubmit} className="mb-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for a Turkish or English word..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  className="w-full pr-10"
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  disabled={searchQuery.length < 2}
                >
                  <SearchIcon className="h-5 w-5" />
                </Button>
              </div>
            </form>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Search Results</h3>
              
              <div className="max-h-[500px] overflow-y-auto">
                {error ? (
                  <p className="text-red-500">Error searching words</p>
                ) : searchQuery.length < 2 ? (
                  <p className="text-gray-500 text-center py-4">Type at least 2 characters to search</p>
                ) : isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="border-b border-gray-200 py-3">
                      <Skeleton className="h-6 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))
                ) : searchResults && searchResults.length > 0 ? (
                  searchResults.map(result => (
                    <div
                      key={result.id}
                      onClick={() => handleWordSelect(result.id)}
                      className={`border-b border-gray-200 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedWord?.id === result.id ? 'bg-gray-100' : ''}`}
                    >
                      <p className="font-medium text-[#E81C23]">{result.turkish}</p>
                      <p className="text-sm">{result.english}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No results found</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {selectedWord ? (
            isLoadingDetails ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <Skeleton className="h-10 w-1/3 mb-2" />
                <Skeleton className="h-6 w-1/4 mb-1" />
                <Skeleton className="h-8 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : wordDetails ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="font-poppins font-bold text-3xl text-[#E81C23] mb-2">{wordDetails.turkish}</h2>
                <p className="text-gray-600 mb-2">{wordDetails.pronunciation}</p>
                <h3 className="font-poppins text-xl text-dark mb-4">{wordDetails.english}</h3>
                
                <div className="mt-6">
                  <h4 className="font-poppins font-semibold text-lg mb-3">Example Sentences:</h4>
                  <div className="bg-[#E9ECEF] rounded-lg p-4 mb-4">
                    <p className="font-medium text-[#E81C23] mb-1">{wordDetails.exampleTurkish1}</p>
                    <p className="text-dark">{wordDetails.exampleEnglish1}</p>
                  </div>
                  <div className="bg-[#E9ECEF] rounded-lg p-4">
                    <p className="font-medium text-[#E81C23] mb-1">{wordDetails.exampleTurkish2}</p>
                    <p className="text-dark">{wordDetails.exampleEnglish2}</p>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-light pt-4">
                  <h4 className="font-poppins font-semibold text-lg mb-2">Notes:</h4>
                  <p className="text-dark">{wordDetails.notes}</p>
                </div>
              </div>
            ) : null
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="py-8">
                <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Search for a Word</h2>
                <p className="text-gray-500">
                  Search for a Turkish or English word to see its details here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
