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

export interface ApiError {
  error: string;
  errorType?: 'rate_limit' | 'service_unavailable' | 'auth_error' | 'quota_exceeded' | 'unknown';
  details?: string;
}

class ApiService {
  private baseUrl = '/api';

  private async handleApiError(response: Response): Promise<never> {
    let errorData: ApiError;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        error: '网络请求失败',
        errorType: 'unknown'
      };
    }

    const error = new Error(errorData.error);
    (error as any).errorType = errorData.errorType;
    (error as any).details = errorData.details;
    throw error;
  }

  async chat(message: string, history: ChatMessage[] = [], language: 'zh' | 'en' = 'zh'): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history,
        language,
      }),
    });

    if (!response.ok) {
      await this.handleApiError(response);
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
      await this.handleApiError(response);
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
