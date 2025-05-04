import WordOfTheDay from "@/components/word-of-the-day";
import SearchBox from "@/components/search-box";
import WordHistory from "@/components/word-history";
import LearningTips from "@/components/learning-tips";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-10 flex flex-col md:flex-row md:space-x-8">
      {/* Main content */}
      <section className="w-full md:w-2/3 mb-8 md:mb-0">
        <WordOfTheDay />
        
        {/* Search section */}
        <div className="mt-8">
          <SearchBox />
        </div>
      </section>
      
      {/* Sidebar */}
      <aside className="w-full md:w-1/3">
        <WordHistory limit={5} />
        <LearningTips />
      </aside>
    </div>
  );
}
