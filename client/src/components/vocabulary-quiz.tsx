import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { TurkishWord } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Award, 
  Brain, 
  Check, 
  X,
  ArrowRight,
  BarChart,
  RefreshCw,
  Star
} from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { getWordHistory, getSearchedWords } from "@/lib/offlineStorage";
import { addWordToFlashcards } from "@/lib/spacedRepetition";
import { Badge } from "@/components/ui/badge";

// Quiz difficulty levels
enum QuizDifficulty {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

// Question types
enum QuestionType {
  MULTIPLE_CHOICE = "multipleChoice",
  MATCHING = "matching",
  SPELLING = "spelling",
}

interface QuizQuestion {
  type: QuestionType;
  word: TurkishWord;
  choices?: string[];
  correctAnswer: string;
  userAnswer?: string;
}

interface QuizStats {
  correct: number;
  incorrect: number;
  score: number;
  timeSpent: number;
}

export default function VocabularyQuiz() {
  // State
  const [difficulty, setDifficulty] = useState<QuizDifficulty>(QuizDifficulty.BEGINNER);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [stats, setStats] = useState<QuizStats>({
    correct: 0,
    incorrect: 0,
    score: 0,
    timeSpent: 0
  });
  
  // Fetch all words to use in quiz
  const { data: wordsData } = useQuery({
    queryKey: ['/api/words'],
    queryFn: getQueryFn<TurkishWord[]>({ on401: "returnNull" }),
  });
  
  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Progress percentage
  const progressPercentage = quizStarted && questions.length > 0 
    ? Math.round(((currentQuestionIndex) / questions.length) * 100)
    : 0;
  
  // Generate questions based on difficulty
  const generateQuestions = (availableWords: TurkishWord[], selectedDifficulty: QuizDifficulty) => {
    if (!availableWords || availableWords.length === 0) return [];
    
    // Limit the number of questions based on difficulty
    const questionCount = 
      selectedDifficulty === QuizDifficulty.BEGINNER ? 5 : 
      selectedDifficulty === QuizDifficulty.INTERMEDIATE ? 8 : 10;
    
    // Shuffle words and take a subset
    const shuffledWords = [...availableWords].sort(() => Math.random() - 0.5).slice(0, questionCount);
    
    // Generate questions with type based on difficulty
    return shuffledWords.map(word => {
      // Choose question type based on difficulty
      let questionType = QuestionType.MULTIPLE_CHOICE;
      
      if (selectedDifficulty === QuizDifficulty.INTERMEDIATE) {
        // Intermediate has 70% multiple choice, 30% matching
        questionType = Math.random() < 0.7 
          ? QuestionType.MULTIPLE_CHOICE 
          : QuestionType.MATCHING;
      } else if (selectedDifficulty === QuizDifficulty.ADVANCED) {
        // Advanced has 40% multiple choice, 40% matching, 20% spelling
        const rand = Math.random();
        if (rand < 0.4) {
          questionType = QuestionType.MULTIPLE_CHOICE;
        } else if (rand < 0.8) {
          questionType = QuestionType.MATCHING;
        } else {
          questionType = QuestionType.SPELLING;
        }
      }
      
      // Generate 3 wrong choices for multiple choice questions
      const choices = questionType === QuestionType.MULTIPLE_CHOICE
        ? generateChoices(word, availableWords)
        : undefined;
      
      return {
        type: questionType,
        word,
        choices,
        correctAnswer: word.english
      } as QuizQuestion;
    });
  };
  
  // Generate choices for multiple choice questions
  const generateChoices = (correctWord: TurkishWord, allWords: TurkishWord[]) => {
    // Get 3 random incorrect words
    const otherWords = allWords
      .filter(w => w.id !== correctWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.english);
    
    // Add the correct answer and shuffle
    return [...otherWords, correctWord.english].sort(() => Math.random() - 0.5);
  };
  
  // Start quiz with selected difficulty
  const startQuiz = (selectedDifficulty: QuizDifficulty) => {
    if (!wordsData || wordsData.length === 0) return;
    
    // Generate questions
    const newQuestions = generateQuestions(wordsData, selectedDifficulty);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setQuizStarted(true);
    setQuizCompleted(false);
    setShowAnswer(false);
    setDifficulty(selectedDifficulty);
    setStartTime(Date.now());
    setStats({
      correct: 0,
      incorrect: 0,
      score: 0,
      timeSpent: 0
    });
  };
  
  // Handle user answer
  const handleAnswer = (answer: string) => {
    // Update current question with user's answer
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].userAnswer = answer;
    setQuestions(updatedQuestions);
    
    // Show correct answer
    setShowAnswer(true);
    
    // Update stats
    const isCorrect = answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    setStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }));
    
    // Add word to flashcards if answer was incorrect
    if (!isCorrect) {
      addWordToFlashcards(currentQuestion.word);
    }
  };
  
  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setShowAnswer(false);
    } else {
      // Quiz completed
      const endTime = Date.now();
      const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds
      
      // Calculate final score
      const correctCount = questions.filter(q => 
        q.userAnswer?.toLowerCase() === q.correctAnswer.toLowerCase()
      ).length;
      
      const score = Math.round((correctCount / questions.length) * 100);
      
      setStats(prev => ({
        ...prev,
        score,
        timeSpent
      }));
      
      setQuizCompleted(true);
    }
  };
  
  // Restart quiz
  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
  };
  
  // Get difficulty badge color
  const getDifficultyColor = (quizDifficulty: QuizDifficulty) => {
    switch (quizDifficulty) {
      case QuizDifficulty.BEGINNER:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case QuizDifficulty.INTERMEDIATE:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case QuizDifficulty.ADVANCED:
        return "bg-red-100 text-red-800 hover:bg-red-200";
    }
  };
  
  // Get difficulty name with proper capitalization
  const getDifficultyName = (quizDifficulty: QuizDifficulty) => {
    return quizDifficulty.charAt(0).toUpperCase() + quizDifficulty.slice(1);
  };
  
  // The result screen content
  const resultScreen = useMemo(() => {
    if (!quizCompleted) return null;
    
    let feedback = "";
    let icon = null;
    
    // Determine feedback based on score
    if (stats.score >= 90) {
      feedback = "Excellent! You're mastering Turkish vocabulary!";
      icon = <Award className="h-12 w-12 text-yellow-500 mb-2" />;
    } else if (stats.score >= 70) {
      feedback = "Great job! You're making good progress!";
      icon = <Star className="h-12 w-12 text-blue-500 mb-2" />;
    } else if (stats.score >= 50) {
      feedback = "Good effort! Keep practicing to improve!";
      icon = <Brain className="h-12 w-12 text-purple-500 mb-2" />;
    } else {
      feedback = "Nice try! Review the words and try again soon!";
      icon = <RefreshCw className="h-12 w-12 text-green-500 mb-2" />;
    }
    
    return (
      <AlertDialogContent>
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-2xl">Quiz Results</AlertDialogTitle>
          <div className="flex justify-center">
            {icon}
          </div>
          <AlertDialogDescription>{feedback}</AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#1a365d]">{stats.score}%</div>
            <div className="text-sm text-gray-500">Final Score</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-[#1a365d]">{stats.timeSpent}s</div>
            <div className="text-sm text-gray-500">Time Spent</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600">{stats.correct}</div>
            <div className="text-sm text-gray-500">Correct</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-600">{stats.incorrect}</div>
            <div className="text-sm text-gray-500">Incorrect</div>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogAction onClick={restartQuiz}>Try Again</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  }, [quizCompleted, stats]);
  
  // Quiz selection screen
  if (!quizStarted) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-[#1a365d] to-[#2a4365] text-white">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <h3 className="font-semibold">Turkish Vocabulary Quiz</h3>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-center mb-6">Choose Difficulty Level</h2>
          
          <div className="flex flex-col space-y-4">
            {Object.values(QuizDifficulty).map((diff) => (
              <Button
                key={diff}
                variant="outline"
                className={`p-6 h-auto flex justify-between items-center ${getDifficultyColor(diff)}`}
                onClick={() => startQuiz(diff)}
              >
                <div className="flex flex-col items-start">
                  <span className="text-lg font-medium">{getDifficultyName(diff)}</span>
                  <span className="text-xs mt-1">
                    {diff === QuizDifficulty.BEGINNER 
                      ? "5 basic multiple choice questions" 
                      : diff === QuizDifficulty.INTERMEDIATE
                        ? "8 questions with multiple choice and matching"
                        : "10 challenging questions with multiple formats"}
                  </span>
                </div>
                <ArrowRight className="h-5 w-5" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Quiz question screen
  return (
    <>
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-[#1a365d] to-[#2a4365] text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <h3 className="font-semibold">Turkish Quiz</h3>
            </div>
            
            <Badge variant="outline" className="text-xs border-white text-white">
              {getDifficultyName(difficulty)}
            </Badge>
          </div>
        </CardHeader>
        
        <div className="px-4 py-2 bg-gray-100">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>{stats.correct}</span>
              <X className="h-4 w-4 text-red-500 ml-2" />
              <span>{stats.incorrect}</span>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2 mt-2" />
        </div>
        
        {currentQuestion && (
          <CardContent className="p-6">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-[#1a365d] mb-2">{currentQuestion.word.turkish}</h2>
              {currentQuestion.word.pronunciation && (
                <p className="text-gray-600 italic">[{currentQuestion.word.pronunciation}]</p>
              )}
            </div>
            
            {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700 mb-3">Select the correct meaning:</h3>
                {currentQuestion.choices?.map((choice, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full justify-start p-4 h-auto ${
                      showAnswer
                        ? choice === currentQuestion.correctAnswer
                          ? "border-green-500 bg-green-50"
                          : choice === currentQuestion.userAnswer
                            ? "border-red-500 bg-red-50"
                            : ""
                        : ""
                    }`}
                    onClick={() => !showAnswer && handleAnswer(choice)}
                    disabled={showAnswer}
                  >
                    {choice}
                    {showAnswer && choice === currentQuestion.correctAnswer && (
                      <Check className="ml-auto h-5 w-5 text-green-600" />
                    )}
                    {showAnswer && choice === currentQuestion.userAnswer && choice !== currentQuestion.correctAnswer && (
                      <X className="ml-auto h-5 w-5 text-red-600" />
                    )}
                  </Button>
                ))}
              </div>
            )}
            
            {currentQuestion.type === QuestionType.MATCHING && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700 mb-3">What does this word mean?</h3>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full p-3 border rounded-md ${
                      showAnswer
                        ? currentQuestion.userAnswer?.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Type the English meaning..."
                    disabled={showAnswer}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !showAnswer) {
                        const target = e.target as HTMLInputElement;
                        handleAnswer(target.value);
                      }
                    }}
                  />
                  {!showAnswer && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-2 top-2"
                      onClick={() => {
                        const input = document.querySelector('input') as HTMLInputElement;
                        if (input && input.value) {
                          handleAnswer(input.value);
                        }
                      }}
                    >
                      Check
                    </Button>
                  )}
                </div>
                {showAnswer && (
                  <div className={`mt-4 p-3 rounded-md ${
                    currentQuestion.userAnswer?.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}>
                    <p className="font-medium">
                      {currentQuestion.userAnswer?.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
                        ? "Correct!"
                        : "Incorrect!"}
                    </p>
                    <p>The correct answer is: <span className="font-bold">{currentQuestion.correctAnswer}</span></p>
                  </div>
                )}
              </div>
            )}
            
            {currentQuestion.type === QuestionType.SPELLING && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700 mb-3">Spell the English translation:</h3>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full p-3 border rounded-md ${
                      showAnswer
                        ? currentQuestion.userAnswer?.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Type the English meaning with correct spelling..."
                    disabled={showAnswer}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !showAnswer) {
                        const target = e.target as HTMLInputElement;
                        handleAnswer(target.value);
                      }
                    }}
                  />
                  {!showAnswer && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute right-2 top-2"
                      onClick={() => {
                        const input = document.querySelector('input') as HTMLInputElement;
                        if (input && input.value) {
                          handleAnswer(input.value);
                        }
                      }}
                    >
                      Check
                    </Button>
                  )}
                </div>
                {showAnswer && (
                  <div className={`mt-4 p-3 rounded-md ${
                    currentQuestion.userAnswer?.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}>
                    <p className="font-medium">
                      {currentQuestion.userAnswer?.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
                        ? "Correct!"
                        : "Incorrect!"}
                    </p>
                    <p>The correct answer is: <span className="font-bold">{currentQuestion.correctAnswer}</span></p>
                    {currentQuestion.word.exampleTurkish1 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-sm text-gray-700">{currentQuestion.word.exampleTurkish1}</p>
                        <p className="text-sm text-gray-600 italic">{currentQuestion.word.exampleEnglish1}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        )}
        
        <CardFooter className="p-4 bg-gray-50 flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={restartQuiz}
          >
            Restart Quiz
          </Button>
          
          {showAnswer && (
            <Button onClick={nextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {quizCompleted && resultScreen}
    </>
  );
}