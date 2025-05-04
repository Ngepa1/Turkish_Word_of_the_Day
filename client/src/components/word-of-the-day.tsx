import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Share2, Volume2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { WordOfTheDay as WordOfTheDayType } from "@/lib/types";

export default function WordOfTheDay() {
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<WordOfTheDayType>({
    queryKey: ["/api/word/today"],
  });

  const handlePlayAudio = () => {
    toast({
      title: "Audio Pronunciation",
      description: `Playing audio for "${data?.word.turkish}" is not available yet.`,
    });
  };

  const handleShareWord = () => {
    if (!data) return;
    
    const shareText = `Learn Turkish! Today's word is: ${data.word.turkish} - ${data.word.english}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Turkish Word of the Day",
        text: shareText,
      }).catch((error) => {
        console.error("Error sharing:", error);
      });
    } else {
      navigator.clipboard.writeText(shareText).then(
        () => {
          toast({
            title: "Copied to clipboard!",
            description: "You can now paste the word and share it.",
          });
        },
        (err) => {
          console.error("Could not copy text: ", err);
          toast({
            title: "Error",
            description: "Could not copy to clipboard.",
            variant: "destructive",
          });
        }
      );
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-red-500">Error loading today's word</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  const currentDate = format(new Date(), "MMMM d, yyyy");

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Date Banner */}
      <div className="bg-[#E81C23] text-white py-2 px-4 flex justify-between items-center">
        <span className="font-poppins font-medium">{currentDate}</span>
        <span className="text-sm text-[#F5B335] font-medium">Word of the Day</span>
      </div>
      
      {/* Word Card */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          {isLoading ? (
            <div>
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-16" />
            </div>
          ) : (
            <div>
              <h2 className="font-poppins font-bold text-4xl text-[#E81C23] mb-1">{data?.word.turkish}</h2>
              <p className="text-gray-600 mb-2">{data?.word.pronunciation}</p>
              <h3 className="font-poppins text-xl text-dark">{data?.word.english}</h3>
            </div>
          )}
          
          {/* Audio Playback */}
          <Button 
            onClick={handlePlayAudio} 
            className="bg-[#00A9E0] hover:bg-blue-600 text-white rounded-full p-3 h-12 w-12" 
            aria-label="Play pronunciation"
          >
            <Volume2 className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Example Sentences */}
        <div className="mt-8">
          <h4 className="font-poppins font-semibold text-lg mb-3">Example Sentences:</h4>
          {isLoading ? (
            <>
              <Skeleton className="h-24 w-full mb-4" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            <>
              <div className="bg-[#E9ECEF] rounded-lg p-4 mb-4">
                <p className="font-medium text-[#E81C23] mb-1">{data?.word.exampleTurkish1}</p>
                <p className="text-dark">{data?.word.exampleEnglish1}</p>
              </div>
              <div className="bg-[#E9ECEF] rounded-lg p-4">
                <p className="font-medium text-[#E81C23] mb-1">{data?.word.exampleTurkish2}</p>
                <p className="text-dark">{data?.word.exampleEnglish2}</p>
              </div>
            </>
          )}
        </div>
        
        {/* Word Notes */}
        <div className="mt-6 border-t border-gray-light pt-4">
          <h4 className="font-poppins font-semibold text-lg mb-2">Notes:</h4>
          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <p className="text-dark">{data?.word.notes}</p>
          )}
        </div>
        
        {/* Share Button */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleShareWord}
            disabled={isLoading}
            className="flex items-center text-[#00A9E0] hover:text-[#E81C23] transition-colors duration-200"
          >
            <Share2 className="h-5 w-5 mr-1" />
            Share this word
          </button>
        </div>
      </div>
    </div>
  );
}
