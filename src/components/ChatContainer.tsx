import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Button } from "./ui/button";
import { Dumbbell, Sparkles, CheckCircle2, Languages } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export const ChatContainer = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const translations = {
    zh: {
      title: "weekwise",
      subtitle: "一键生成可打印的周健身计划",
      initialMessage: "你好！我是你的私人健身教练 🏋️‍♂️ 告诉我你的健身目标，我会为你定制专属训练计划！",
      aiResponse: "太好了！我已经根据你的目标分析了最适合的训练方案。让我们开始打造更好的自己吧！💪",
      completedTitle: "训练计划已生成！",
      completedSubtitle: "根据你的目标定制的专属方案已准备就绪",
      buttonText: "打印周健身计划"
    },
    en: {
      title: "weekwise",
      subtitle: "Print your progress. One week at a time.",
      initialMessage: "Hello! I'm your personal fitness coach 🏋️‍♂️ Tell me your fitness goals and I'll create a custom training plan for you!",
      aiResponse: "Great! I've analyzed the best training program for your goals. Let's start building a better you! 💪",
      completedTitle: "Training Plan Generated!",
      completedSubtitle: "Your customized plan based on your goals is ready",
      buttonText: "Print Weekly Fitness Plan"
    }
  };

  const t = translations[language];

  // Initialize welcome message
  useEffect(() => {
    setMessages([{
      id: "1",
      text: t.initialMessage,
      isUser: false,
    }]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // 模拟 AI 分析和回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t.aiResponse,
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      
      // 显示完成状态
      setTimeout(() => {
        setIsCompleted(true);
      }, 800);
    }, 2000);
  };

  return (
    <div className="relative flex flex-col h-screen bg-background overflow-hidden">
      {/* 动态背景效果 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      {/* Header */}
      <div className="relative border-b border-border/50 bg-card/30 backdrop-blur-xl p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary bg-[length:200%_200%] animate-gradient-shift flex items-center justify-center shadow-2xl shadow-primary/50">
              <Dumbbell className="w-7 h-7 text-primary-foreground animate-float" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-outfit bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t.subtitle}
              </p>
            </div>
          </div>
          
          {/* Language Toggle Button */}
          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
            aria-label="切换语言"
          >
            <Languages className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-primary">
              {language === 'zh' ? 'EN' : '中文'}
            </span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
            />
          ))}
          {isTyping && (
            <ChatMessage message="" isUser={false} isTyping={true} />
          )}
          
          {/* 完成状态卡片 */}
          {isCompleted && (
            <div className="flex justify-center animate-scale-in mt-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-card border border-border/50 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-success animate-scale-in" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{t.completedTitle}</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        {t.completedSubtitle}
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-base font-semibold px-8 py-6 rounded-xl"
                      onClick={() => navigate('/training-plan')}
                    >
                      <Dumbbell className="w-5 h-5 mr-2" />
                      {t.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - 只在未完成时显示 */}
      {!isCompleted && (
        <div className="relative">
          <ChatInput onSend={handleSendMessage} disabled={isTyping} />
        </div>
      )}
    </div>
  );
};
