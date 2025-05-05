import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TurkishWord } from "@/lib/types";
import { getQueryFn } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Flashcard from "@/components/flashcard";
import VocabularyQuiz from "@/components/vocabulary-quiz";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDueFlashcards, getAllFlashcards } from "@/lib/spacedRepetition";
import { Brain, Lightbulb, BookOpen } from "lucide-react";
import LearningProgress from "@/components/learning-progress";

export default function Practice() {
  // State
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [practiceMode, setPracticeMode] = useState<"due" | "all" | "random">("due");
  
  // Fetch all words
  const { data: words } = useQuery({
    queryKey: ['/api/words'],
    queryFn: getQueryFn<TurkishWord[]>({ on401: "returnNull" }),
  });
  
  // Get different sets of flashcards based on mode
  const dueFlashcards = getDueFlashcards();
  const allFlashcards = getAllFlashcards();
  
  // Get words from flashcards
  const flashcardWords = 
    practiceMode === "due" ? dueFlashcards.map(fc => fc.word) :
    practiceMode === "all" ? allFlashcards.map(fc => fc.word) :
    words ? [...words].sort(() => Math.random() - 0.5).slice(0, 10) : [];
  
  // Handle "next" button on flashcard
  const handleNextFlashcard = () => {
    if (flashcardIndex < flashcardWords.length - 1) {
      setFlashcardIndex(prev => prev + 1);
    } else {
      // Wrap around to the beginning if at the end
      setFlashcardIndex(0);
    }
  };
  
  // Handle "previous" button on flashcard
  const handlePreviousFlashcard = () => {
    if (flashcardIndex > 0) {
      setFlashcardIndex(prev => prev - 1);
    } else {
      // Wrap around to the end if at the beginning
      setFlashcardIndex(flashcardWords.length - 1);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <LearningProgress />
          
          <Card className="mb-6">
            <CardHeader className="bg-gradient-to-r from-[#1a365d] to-[#2a4365] text-white">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <h3 className="font-semibold">Practice Options</h3>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <h4 className="font-medium mb-2">Flashcard Set</h4>
                
                <Button
                  variant={practiceMode === "due" ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setPracticeMode("due");
                    setFlashcardIndex(0);
                  }}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Due for Review ({dueFlashcards.length})
                </Button>
                
                <Button
                  variant={practiceMode === "all" ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setPracticeMode("all");
                    setFlashcardIndex(0);
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  All Flashcards ({allFlashcards.length})
                </Button>
                
                <Button
                  variant={practiceMode === "random" ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setPracticeMode("random");
                    setFlashcardIndex(0);
                  }}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Random Words
                </Button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium mb-2">Statistics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-100 p-2 rounded">
                    <span className="block text-gray-500">Flashcards</span>
                    <span className="font-semibold">{allFlashcards.length}</span>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <span className="block text-gray-500">Due Today</span>
                    <span className="font-semibold">{dueFlashcards.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="flashcards" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="flashcards" className="flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                Flashcards
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                Quiz
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="flashcards" className="mt-6">
              {flashcardWords.length > 0 ? (
                <div>
                  <Flashcard 
                    word={flashcardWords[flashcardIndex]} 
                    onNext={handleNextFlashcard} 
                  />
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      onClick={handlePreviousFlashcard}
                      disabled={flashcardWords.length <= 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="text-sm self-center">
                      {flashcardIndex + 1} of {flashcardWords.length}
                    </div>
                    
                    <Button 
                      onClick={handleNextFlashcard}
                      disabled={flashcardWords.length <= 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-medium mb-2">No Flashcards Available</h3>
                    <p className="text-gray-600 mb-4">
                      {practiceMode === "due" 
                        ? "You don't have any flashcards due for review today." 
                        : "You haven't added any flashcards yet."}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setPracticeMode("random")}
                    >
                      Practice Random Words
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="quiz" className="mt-6">
              <VocabularyQuiz />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}