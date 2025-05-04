import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-poppins mb-6">About Günün Kelimesi</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About The App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <span className="font-semibold text-[#E81C23]">Günün Kelimesi</span> (Word of the Day) is designed 
              to help English speakers learn Turkish vocabulary one word at a time. 
            </p>
            <p>
              Each day, we feature a new Turkish word with its pronunciation, meaning, 
              example sentences, and cultural context to help you build your Turkish vocabulary steadily.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Turkish Language</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Turkish is a Turkic language spoken by about 80 million people, primarily in Turkey and Northern Cyprus. 
              It's also spoken by communities in Germany, Bulgaria, North Macedonia, Greece, and other parts of Eastern Europe and Central Asia.
            </p>
            <p>
              Turkish uses the Latin alphabet with some modified letters: ç, ğ, ı, ö, ş, and ü. 
              It's an agglutinative language, which means words can get quite long as suffixes are added to express grammatical functions.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Turkish Alphabet</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#E9ECEF] p-3 rounded-lg">
                <p className="font-bold text-[#E81C23]">Aa</p>
                <p className="text-sm">like 'a' in "father"</p>
              </div>
              <div className="bg-[#E9ECEF] p-3 rounded-lg">
                <p className="font-bold text-[#E81C23]">Bb</p>
                <p className="text-sm">like 'b' in "bed"</p>
              </div>
              <div className="bg-[#E9ECEF] p-3 rounded-lg">
                <p className="font-bold text-[#E81C23]">Cc</p>
                <p className="text-sm">like 'j' in "jam"</p>
              </div>
              <div className="bg-[#E9ECEF] p-3 rounded-lg">
                <p className="font-bold text-[#E81C23]">Çç</p>
                <p className="text-sm">like 'ch' in "chair"</p>
              </div>
              <div className="bg-[#E9ECEF] p-3 rounded-lg">
                <p className="font-bold text-[#E81C23]">Ğğ</p>
                <p className="text-sm">lengthens preceding vowel</p>
              </div>
              <div className="bg-[#E9ECEF] p-3 rounded-lg">
                <p className="font-bold text-[#E81C23]">Iı</p>
                <p className="text-sm">like 'u' in "supply"</p>
              </div>
              <div className="bg-[#E9ECEF] p-3 rounded-lg">
                <p className="font-bold text-[#E81C23]">İi</p>
                <p className="text-sm">like 'ee' in "see"</p>
              </div>
              <div className="bg-[#E9ECEF] p-3 rounded-lg">
                <p className="font-bold text-[#E81C23]">Öö</p>
                <p className="text-sm">like 'u' in "burn"</p>
              </div>
              <div className="bg-[#E9ECEF] p-3 rounded-lg">
                <p className="font-bold text-[#E81C23]">Şş</p>
                <p className="text-sm">like 'sh' in "shop"</p>
              </div>
              <div className="bg-[#E9ECEF] p-3 rounded-lg">
                <p className="font-bold text-[#E81C23]">Üü</p>
                <p className="text-sm">like 'u' in "cute"</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Learning Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-[#00A9E0] font-bold mr-2">•</span>
                <span>Practice daily with our Word of the Day.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00A9E0] font-bold mr-2">•</span>
                <span>Try to use the word in a sentence of your own to help with memorization.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00A9E0] font-bold mr-2">•</span>
                <span>Read example sentences out loud to practice pronunciation.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00A9E0] font-bold mr-2">•</span>
                <span>Pay attention to vowel harmony, a key feature of Turkish grammar.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00A9E0] font-bold mr-2">•</span>
                <span>Learn related words and phrases to build your vocabulary more efficiently.</span>
              </li>
            </ul>
            
            <Separator className="my-6" />
            
            <h3 className="font-semibold text-lg mb-4">Useful Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.duolingo.com/course/tr/en/Learn-Turkish" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#00A9E0] hover:text-[#E81C23] transition-colors"
                >
                  Duolingo Turkish Course
                </a>
              </li>
              <li>
                <a 
                  href="https://www.turkishclass101.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#00A9E0] hover:text-[#E81C23] transition-colors"
                >
                  TurkishClass101
                </a>
              </li>
              <li>
                <a 
                  href="https://www.memrise.com/courses/english/turkish/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#00A9E0] hover:text-[#E81C23] transition-colors"
                >
                  Memrise Turkish Courses
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
