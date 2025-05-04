import { Link } from "wouter";

export default function LearningTips() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-[#F5B335] text-white py-2 px-4">
        <h3 className="font-poppins font-semibold">Turkish Learning Tips</h3>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <h4 className="font-poppins font-medium text-dark mb-2">Turkish Pronunciation</h4>
          <p className="text-sm">Turkish pronunciation is very consistent. Once you learn the rules, you can correctly pronounce any word you read.</p>
        </div>
        <div className="mb-4">
          <h4 className="font-poppins font-medium text-dark mb-2">Special Characters</h4>
          <p className="text-sm">Turkish has several special characters: ç, ğ, ı, ö, ş, and ü. Each has a distinct pronunciation.</p>
        </div>
        <div>
          <h4 className="font-poppins font-medium text-dark mb-2">Daily Practice</h4>
          <p className="text-sm">Try to use each word of the day in a sentence of your own to help with memorization.</p>
        </div>
        <div className="mt-3 text-center">
          <Link href="/about">
            <a className="text-[#00A9E0] hover:text-[#E81C23] text-sm font-medium transition-colors duration-200">
              More Learning Resources
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
