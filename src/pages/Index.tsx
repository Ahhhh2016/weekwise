import { ChatContainer } from "@/components/ChatContainer";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleTrainingPlanGenerated = (trainingPlan: any) => {
    console.log('🏠 Index - 接收到训练计划，存储到localStorage');
    // 将训练计划数据存储到localStorage，以便TrainingPlan页面可以访问
    localStorage.setItem('generatedTrainingPlan', JSON.stringify(trainingPlan));
    // 不再自动跳转，让用户点击按钮后在新标签页打开
  };

  return <ChatContainer onTrainingPlanGenerated={handleTrainingPlanGenerated} />;
};

export default Index;
