import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/30 backdrop-blur-xl p-6 shadow-2xl z-50">
      <div className="flex flex-col gap-3 max-w-4xl mx-auto">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder=""
          className="min-h-[100px] resize-none bg-input/50 backdrop-blur-sm border-border/50 focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-primary transition-all rounded-2xl shadow-lg"
          disabled={disabled}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="px-8 py-3 bg-gradient-to-br from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 rounded-2xl disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

