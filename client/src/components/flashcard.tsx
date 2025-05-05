import { useState } from "react";
import { TurkishWord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Lightbulb, Plus, X, Check, RotateCcw, ChevronsUp, ChevronsDown } from "lucide-react";
import { addWordToFlashcards, getFlashcardById, updateFlashcard, removeFlashcard, REPETITION_LEVELS } from "@/lib/spacedRepetition";
import { Badge } from "@/components/ui/badge";

interface FlashcardProps {
  word: TurkishWord;
  onNext?: () => void;
}

export default function Flashcard({ word, onNext }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  // Get flashcard info if it exists
  const flashcard = getFlashcardById(word.id);
  const isInCollection = !!flashcard;
  
  // Format dates for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Get level label
  const getLevelLabel = (level: number) => {
    switch(level) {
      case REPETITION_LEVELS.NEW: return "New";
      case REPETITION_LEVELS.LEVEL_1: return "Level 1";
      case REPETITION_LEVELS.LEVEL_2: return "Level 2";
      case REPETITION_LEVELS.LEVEL_3: return "Level 3";
      case REPETITION_LEVELS.LEVEL_4: return "Level 4";
      case REPETITION_LEVELS.LEVEL_5: return "Level 5";
      case REPETITION_LEVELS.MASTERED: return "Mastered";
      default: return "Unknown";
    }
  };
  
  // Handle user marking answer as incorrect
  const handleIncorrect = () => {
    if (isInCollection) {
      updateFlashcard(word.id, false);
    } else {
      addWordToFlashcards(word);
    }
    
    // Show next card if available
    if (onNext) {
      setFlipped(false);
      setShowActions(false);
      onNext();
    }
  };
  
  // Handle user marking answer as correct
  const handleCorrect = () => {
    if (isInCollection) {
      updateFlashcard(word.id, true);
    } else {
      addWordToFlashcards(word);
      updateFlashcard(word.id, true);
    }
    
    // Show next card if available
    if (onNext) {
      setFlipped(false);
      setShowActions(false);
      onNext();
    }
  };
  
  // Add word to flashcards
  const handleAddToFlashcards = () => {
    addWordToFlashcards(word);
    setShowActions(true);
  };
  
  // Remove word from flashcards
  const handleRemoveFromFlashcards = () => {
    removeFlashcard(word.id);
    setShowActions(false);
  };
  
  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#1a365d] to-[#2a4365] text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5" />
          <h3 className="font-semibold">Flashcard</h3>
        </div>
        
        {isInCollection && (
          <Badge variant="outline" className="text-xs border-white text-white">
            {getLevelLabel(flashcard.level)}
          </Badge>
        )}
      </CardHeader>
      
      <div 
        className={`relative cursor-pointer transition-transform duration-500 transform-gpu ${flipped ? 'rotate-y-180' : ''}`}
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <CardContent className="p-6 min-h-[200px] flex flex-col justify-center items-center">
          {!flipped ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1a365d] mb-2">{word.turkish}</h2>
              {word.pronunciation && (
                <p className="text-gray-600 italic mb-4">[{word.pronunciation}]</p>
              )}
              {word.partOfSpeech && (
                <Badge variant="secondary" className="text-xs">
                  {word.partOfSpeech}
                </Badge>
              )}
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#E81C23] mb-3">{word.english}</h3>
              
              {(word.exampleTurkish1 && word.exampleEnglish1) && (
                <div className="mt-4 text-left">
                  <p className="text-sm text-gray-800 font-medium">{word.exampleTurkish1}</p>
                  <p className="text-sm text-gray-600 italic">{word.exampleEnglish1}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>
      
      <CardFooter className="p-4 bg-gray-50 flex flex-wrap gap-2 justify-between">
        <div>
          {!isInCollection ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddToFlashcards}
              className="flex items-center text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add to Flashcards
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRemoveFromFlashcards}
              className="flex items-center text-xs text-red-500 hover:text-red-600"
            >
              <X className="h-3 w-3 mr-1" />
              Remove
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          {(showActions || isInCollection) && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleIncorrect}
                className="flex items-center text-xs text-red-500"
              >
                <ChevronsDown className="h-3 w-3 mr-1" />
                Difficult
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCorrect}
                className="flex items-center text-xs text-green-500"
              >
                <ChevronsUp className="h-3 w-3 mr-1" />
                Easy
              </Button>
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              setFlipped(!flipped);
            }}
            className="flex items-center text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Flip
          </Button>
        </div>
      </CardFooter>
      
      {isInCollection && (
        <div className="px-4 py-2 bg-gray-100 text-xs text-gray-500 flex justify-between">
          <span>Last review: {formatDate(flashcard.lastReviewDate)}</span>
          <span>Next review: {formatDate(flashcard.nextReviewDate)}</span>
        </div>
      )}
    </Card>
  );
}