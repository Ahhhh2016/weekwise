// API服务文件
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TrainingDay {
  day: string;
  content: string;
  duration: string;
  notes: string;
}

export interface TrainingStrategy {
  title: string;
  description: string;
}

export interface TrainingPlan {
  title: string;
  subtitle: string;
  schedule: TrainingDay[];
  tips: string[];
  strategies: TrainingStrategy[];
}

export interface ChatResponse {
  response: string;
  trainingPlan: TrainingPlan | null;
}

export interface GeneratePlanResponse {
  response: string;
  trainingPlan: TrainingPlan | null;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  azureConfig: {
    endpoint: string;
    model: string;
    hasToken: boolean;
  };
}

class ApiService {
  private baseUrl = '/api';

  async chat(message: string, history: ChatMessage[] = []): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || '聊天请求失败');
    }

    return response.json();
  }

  async generatePlan(prompt: string): Promise<GeneratePlanResponse> {
    const response = await fetch(`${this.baseUrl}/generate-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || '生成训练计划失败');
    }

    return response.json();
  }

  async checkHealth(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}/health`);
    
    if (!response.ok) {
      throw new Error('健康检查失败');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
