import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";

interface AnimatedAddPromptProps {
  text: string;
  onClick: () => void;
}

export function AnimatedAddPrompt({ text, onClick }: AnimatedAddPromptProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-2 cursor-pointer group px-3 py-2 rounded-lg bg-primary/2 hover:bg-primary/10 transition-all duration-300 hover:shadow-sm"
    >
      <div className="text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
        {text}
      </div>
      <div className="relative h-6 w-6">
        <ArrowRight
          className={`absolute inset-0 h-6 w-6 text-primary transition-all duration-300 ${
            isHovered
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100 animate-pulse"
          }`}
        />
        <Plus
          className={`absolute inset-0 h-6 w-6 text-primary transition-all duration-300 ${
            isHovered
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0"
          }`}
        />
      </div>
    </div>
  );
}
