import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isTyping?: boolean;
}

export const ChatMessage = ({ message, isUser, isTyping }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-4 animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 ring-2 ring-primary/20">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-5 py-3.5 shadow-xl transition-all duration-300",
          isUser
            ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-primary/30"
            : "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-primary/30"
        )}
      >
        {isTyping ? (
          <div className="flex gap-1.5 py-1">
            <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse-glow" style={{ animationDelay: "0s" }} />
            <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse-glow" style={{ animationDelay: "0.2s" }} />
            <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse-glow" style={{ animationDelay: "0.4s" }} />
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.split(/(".*?")/g).map((part, index) => {
              if (part.startsWith('"') && part.endsWith('"')) {
                return (
                  <span key={index} className="italic font-medium text-primary-foreground/90 bg-white/10 px-2 py-0.5 rounded">
                    {part}
                  </span>
                );
              }
              return part;
            })}
          </p>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-muted/80 backdrop-blur-sm flex items-center justify-center shadow-lg border border-border/50">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
