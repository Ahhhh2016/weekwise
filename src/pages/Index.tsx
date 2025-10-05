import { ChatContainer } from "@/components/ChatContainer";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleTrainingPlanGenerated = (trainingPlan: any) => {
    console.log('🏠 Index - 接收到训练计划，准备导航到TrainingPlan页面');
    // 将训练计划数据存储到localStorage，以便TrainingPlan页面可以访问
    localStorage.setItem('generatedTrainingPlan', JSON.stringify(trainingPlan));
    // 导航到训练计划页面
    navigate('/training-plan');
  };

  return <ChatContainer onTrainingPlanGenerated={handleTrainingPlanGenerated} />;
};

export default Index;
