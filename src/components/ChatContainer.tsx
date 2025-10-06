import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Button } from "./ui/button";
import { Dumbbell, CheckCircle2, Languages } from "lucide-react";
import { apiService } from "../lib/api";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface ChatContainerProps {
  onTrainingPlanGenerated?: (trainingPlan: any) => void;
}

export const ChatContainer = ({ onTrainingPlanGenerated }: ChatContainerProps) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const translations = {
    zh: {
      title: "weekwise",
      subtitle: "智能生成你的每周训练计划，把进步贴在墙上，一周一小步。",
      initialMessage: "哈喽！我是你的健身伙伴weekwise 🏋🏻‍♂️\n告诉我你的目标，我会帮你制定一个属于你的每周训练计划。\n\n你可以这样告诉我：\n\n\"我想减脂但不想太累\"\n\"我最近在练CrossFit，想更系统地安排训练\"\n\"我想改善体态，多练核心和背部\"\n\"我没有器械，只能在家练\"\n\n或者，直接和我聊聊：\n\n\"我想变得更有力量。\"\n\"我希望能坚持下来，不再半途而废。\"\n\n我会倾听，然后帮你把目标变成一个可以贴在墙上的计划 🧾💪",
      aiResponse: "太好了！我已经根据你的目标分析了最适合的训练方案。让我们开始打造更好的自己吧！🎉",
      completedTitle: "训练计划已生成！",
      completedSubtitle: "想调整内容吗？直接点击就能修改，准备好后从右上角打印吧。🌱",
      buttonText: "打印周健身计划"
    },
    en: {
      title: "weekwise",
      subtitle: "Talk. Train. Transform.",
      initialMessage: "Hello! I'm Weekwise, your fitness buddy 🏋🏻‍♂️\n Tell me your goals and I'll create a weekly training plan just for you. \n\nYou can tell me things like: \n\n\"I want to lose fat without overtraining myself.\"\n\"I've been doing CrossFit lately and want a more structured approach.\"\n\"I want to improve my posture and focus on my core and back.\"\n\"I don't have any equipment, so I can only train at home.\"\n\nOr, just chat with me: \n\n\"I want to get stronger.\"\n\"I hope to stick with it and not give up halfway.\"\n\nI'll listen and help you turn your goals into a plan you can post on your wall 🧾💪",
      aiResponse: "Great! I've analyzed the best training program for your goals. Let's start building a better you! 🎉",
      completedTitle: "Training Plan Generated!",
      completedSubtitle: "Want to adjust the content? Just click to modify it, and print it from the top right corner when you are ready. 🌱",
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

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // 调用聊天API
      const chatHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));

      const chatResponse = await apiService.chat(text, chatHistory);
      
      // 添加调试信息
      console.log('🔍 ChatContainer - AI响应数据:', chatResponse);
      console.log('🔍 ChatContainer - 训练计划数据:', chatResponse.trainingPlan);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: chatResponse.response,
        isUser: false,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      // 检查是否有训练计划生成
      if (chatResponse.trainingPlan) {
        console.log('✅ ChatContainer - 检测到训练计划，准备传递给TrainingPlan组件');
        if (onTrainingPlanGenerated) {
          console.log('📤 ChatContainer - 调用onTrainingPlanGenerated回调');
          onTrainingPlanGenerated(chatResponse.trainingPlan);
        } else {
          console.warn('⚠️ ChatContainer - onTrainingPlanGenerated回调未定义');
        }
        
        // 显示完成状态
        setTimeout(() => {
          setIsCompleted(true);
        }, 800);
      } else {
        console.log('❌ ChatContainer - 未检测到训练计划数据');
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'zh' 
          ? "抱歉，AI服务暂时不可用。请稍后再试。" 
          : "Sorry, AI service is temporarily unavailable. Please try again later.",
        isUser: false,
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-background overflow-hidden">
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
              <p className="text-sm text-muted-foreground">
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
      <div className="relative flex-1 overflow-y-auto p-6 pb-32">
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
            <div className="flex justify-center animate-scale-in mt-2">
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
