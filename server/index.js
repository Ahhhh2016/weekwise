import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

// 获取当前文件的目录路径（ES模块中的__dirname替代方案）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// GitHub AI配置
const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

// 创建Azure AI客户端
const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token)
);

// 训练计划生成提示词模板
const TRAINING_PLAN_PROMPTS = {
  zh: `你是一个专业的健身教练和训练计划制定专家。请根据用户的需求生成一个详细的周训练计划。

要求：
1. 生成一个7天的训练计划，包含每天的具体训练内容
2. 每个训练日包含：训练内容、时长、重点/备注
3. 训练内容要平衡力量训练、有氧训练和恢复
4. 考虑用户的健身水平和可用时间
5. 提供实用的训练提示和策略建议
6. 使用中文回复，语言要专业但易懂

特别要求：
- tips数组：提供4-6条实用的每日训练提示，包括休息时间、营养补充、安全注意事项等
- strategies数组：提供6-8个关键训练策略，每个策略包含简洁的标题和描述，涵盖渐进式负荷、多样化训练、恢复、动作规范等方面

请以以下JSON格式返回训练计划数据：
{
  "response": "你的回复文本",
  "trainingPlan": {
    "title": "训练计划标题",
    "subtitle": "副标题",
    "schedule": [
      {
        "day": "周一",
        "content": "训练内容",
        "duration": "时长",
        "notes": "重点/备注"
      }
    ],
    "tips": [
      "每组之间休息30-90秒，根据训练强度适当调整",
      "注意补充水分，训练前后适量摄入蛋白质",
      "若感到疲劳或不适，可适当调整训练量或休息",
      "训练动作要规范，避免因追求重量而牺牲动作质量"
    ],
    "strategies": [
      {
        "title": "渐进式负荷",
        "description": "每周可适当增加训练重量或组数"
      },
      {
        "title": "多样化训练",
        "description": "力量与有氧结合，避免训练疲劳"
      },
      {
        "title": "充分恢复",
        "description": "保证充足睡眠，有助肌肉修复"
      },
      {
        "title": "动作规范",
        "description": "安全和动作质量为主要优先级"
      },
      {
        "title": "有氧力量结合",
        "description": "两者结合效果最佳"
      },
      {
        "title": "早晨训练",
        "description": "坚持4周即可形成习惯"
      },
      {
        "title": "心理建设",
        "description": "完成后打勾增强成就感"
      },
      {
        "title": "强度管理",
        "description": "专注于完成动作和呼吸"
      }
    ]
  }
}`,
  en: `You are a professional fitness coach and training plan expert. Please generate a detailed weekly training plan based on the user's needs.

Requirements:
1. Generate a 7-day training plan with specific training content for each day
2. Each training day should include: training content, duration, key points/notes
3. Training content should balance strength training, cardio, and recovery
4. Consider the user's fitness level and available time
5. Provide practical training tips and strategy suggestions
6. Use English for responses, professional but easy to understand

Special requirements:
- tips array: Provide 4-6 practical daily training tips, including rest time, nutrition, safety precautions, etc.
- strategies array: Provide 6-8 key training strategies, each with a concise title and description, covering progressive overload, training variety, recovery, proper form, etc.

Please return the training plan data in the following JSON format:
{
  "response": "Your response text",
  "trainingPlan": {
    "title": "Training Plan Title",
    "subtitle": "Subtitle",
    "schedule": [
      {
        "day": "Monday",
        "content": "Training content",
        "duration": "Duration",
        "notes": "Key points/notes"
      }
    ],
    "tips": [
      "Rest 30-90 seconds between sets, adjust based on training intensity",
      "Stay hydrated, consume protein before and after training",
      "If feeling fatigued or unwell, adjust training volume or rest",
      "Maintain proper form, avoid sacrificing technique for weight"
    ],
    "strategies": [
      {
        "title": "Progressive Overload",
        "description": "Gradually increase training weight or sets weekly"
      },
      {
        "title": "Training Variety",
        "description": "Combine strength and cardio to avoid training fatigue"
      },
      {
        "title": "Adequate Recovery",
        "description": "Ensure sufficient sleep for muscle repair"
      },
      {
        "title": "Proper Form",
        "description": "Safety and movement quality are top priorities"
      },
      {
        "title": "Cardio-Strength Balance",
        "description": "Combining both yields the best results"
      },
      {
        "title": "Morning Training",
        "description": "Consistency for 4 weeks builds lasting habits"
      },
      {
        "title": "Mental Preparation",
        "description": "Check off completed workouts to boost motivation"
      },
      {
        "title": "Intensity Management",
        "description": "Focus on completing movements and breathing"
      }
    ]
  }
}`
};

// 聊天API端点
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history = [], language = 'zh' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: '消息内容不能为空' });
        }

        // 根据语言选择相应的提示词
        const prompt = TRAINING_PLAN_PROMPTS[language] || TRAINING_PLAN_PROMPTS.zh;

        // 构建消息历史
        const messages = [
            { role: "system", content: prompt },
            ...history,
            { role: "user", content: message }
        ];

        // 调用Azure AI
        const response = await client.path("/chat/completions").post({
            body: {
                messages: messages,
                temperature: 0.7,
                top_p: 0.9,
                model: model,
                max_tokens: 2000
            }
        });

        if (isUnexpected(response)) {
            throw new Error(`Azure AI API error: ${response.status} - ${response.body?.error?.message || 'Unknown error'}`);
        }

        const aiResponse = response.body.choices[0].message.content;
        
        // 添加调试信息
        console.log('🤖 服务器 - AI原始响应:', aiResponse);
        console.log('🤖 服务器 - 响应类型:', typeof aiResponse);
        console.log('🤖 服务器 - 响应长度:', aiResponse.length);
        
        // 尝试解析JSON响应
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(aiResponse);
            console.log('✅ 服务器 - JSON解析成功:', parsedResponse);
        } catch (parseError) {
            console.log('❌ 服务器 - JSON解析失败:', parseError.message);
            console.log('📝 服务器 - 原始响应内容:', aiResponse);
            // 如果不是JSON格式，创建默认响应
            parsedResponse = {
                response: aiResponse,
                trainingPlan: null
            };
        }

        console.log('📤 服务器 - 最终响应:', parsedResponse);
        res.json(parsedResponse);

    } catch (error) {
        console.error('Chat API error:', error);
        
        // 检查是否是rate limit或API不可用错误
        let errorType = 'unknown';
        let userMessage = '服务器内部错误';
        let statusCode = 500;
        
        // 根据语言选择错误消息
        const errorMessages = {
            zh: {
                rate_limit: '请求过于频繁，请稍后再试',
                service_unavailable: 'AI服务暂时不可用，请稍后再试',
                auth_error: 'AI服务认证失败，请联系管理员',
                quota_exceeded: 'AI服务配额已用完，请稍后再试',
                default: '抱歉，AI服务暂时不可用。请稍后再试。'
            },
            en: {
                rate_limit: 'Too many requests. Please wait 1-2 minutes before trying again.',
                service_unavailable: 'AI service is temporarily unavailable. Please try again later.',
                auth_error: 'AI service authentication failed. Please contact administrator.',
                quota_exceeded: 'AI service quota exceeded. Please try again later.',
                default: 'Sorry, AI service is temporarily unavailable. Please try again later.'
            }
        };
        
        if (error.message.includes('rate limit') || error.message.includes('429')) {
            errorType = 'rate_limit';
            userMessage = errorMessages[language]?.rate_limit || errorMessages.zh.rate_limit;
            statusCode = 429;
        } else if (error.message.includes('timeout') || error.message.includes('ECONNRESET') || error.message.includes('ENOTFOUND')) {
            errorType = 'service_unavailable';
            userMessage = errorMessages[language]?.service_unavailable || errorMessages.zh.service_unavailable;
            statusCode = 503;
        } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
            errorType = 'auth_error';
            userMessage = errorMessages[language]?.auth_error || errorMessages.zh.auth_error;
            statusCode = 401;
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
            errorType = 'quota_exceeded';
            userMessage = errorMessages[language]?.quota_exceeded || errorMessages.zh.quota_exceeded;
            statusCode = 429;
        } else {
            userMessage = errorMessages[language]?.default || errorMessages.zh.default;
        }
        
        res.status(statusCode).json({ 
            error: userMessage,
            errorType: errorType,
            details: error.message 
        });
    }
});

// 生成训练计划API端点
app.post('/api/generate-plan', async (req, res) => {
    try {
        const { prompt, language = 'zh' } = req.body;
        
        // 根据语言选择相应的提示词
        const systemPrompt = TRAINING_PLAN_PROMPTS[language] || TRAINING_PLAN_PROMPTS.zh;
        const defaultPrompt = language === 'en' ? "Please generate a general weekly training plan" : "请生成一个通用的周训练计划";
        
        const messages = [
            { 
                role: "system", 
                content: systemPrompt 
            },
            { 
                role: "user", 
                content: prompt || defaultPrompt 
            }
        ];

        const response = await client.path("/chat/completions").post({
            body: {
                messages: messages,
                temperature: 0.7,
                top_p: 0.9,
                model: model,
                max_tokens: 2000
            }
        });

        if (isUnexpected(response)) {
            throw new Error(`Azure AI API error: ${response.status} - ${response.body?.error?.message || 'Unknown error'}`);
        }

        const aiResponse = response.body.choices[0].message.content;
        
        // 添加调试信息
        console.log('🤖 服务器 - AI原始响应:', aiResponse);
        console.log('🤖 服务器 - 响应类型:', typeof aiResponse);
        console.log('🤖 服务器 - 响应长度:', aiResponse.length);
        
        // 尝试解析JSON响应
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(aiResponse);
            console.log('✅ 服务器 - JSON解析成功:', parsedResponse);
        } catch (parseError) {
            console.log('❌ 服务器 - JSON解析失败:', parseError.message);
            console.log('📝 服务器 - 原始响应内容:', aiResponse);
            // 如果不是JSON格式，创建默认响应
            parsedResponse = {
                response: aiResponse,
                trainingPlan: null
            };
        }

        console.log('📤 服务器 - 最终响应:', parsedResponse);
        res.json(parsedResponse);

    } catch (error) {
        console.error('Generate plan API error:', error);
        
        // 检查是否是rate limit或API不可用错误
        let errorType = 'unknown';
        let userMessage = '生成训练计划失败';
        let statusCode = 500;
        
        // 根据语言选择错误消息
        const errorMessages = {
            zh: {
                rate_limit: '请求过于频繁，请稍后再试',
                service_unavailable: 'AI服务暂时不可用，请稍后再试',
                auth_error: 'AI服务认证失败，请联系管理员',
                quota_exceeded: 'AI服务配额已用完，请稍后再试',
                default: '生成训练计划失败'
            },
            en: {
                rate_limit: 'Too many requests. Please wait 1-2 minutes before trying again.',
                service_unavailable: 'AI service is temporarily unavailable. Please try again later.',
                auth_error: 'AI service authentication failed. Please contact administrator.',
                quota_exceeded: 'AI service quota exceeded. Please try again later.',
                default: 'Failed to generate training plan'
            }
        };
        
        if (error.message.includes('rate limit') || error.message.includes('429')) {
            errorType = 'rate_limit';
            userMessage = errorMessages[language]?.rate_limit || errorMessages.zh.rate_limit;
            statusCode = 429;
        } else if (error.message.includes('timeout') || error.message.includes('ECONNRESET') || error.message.includes('ENOTFOUND')) {
            errorType = 'service_unavailable';
            userMessage = errorMessages[language]?.service_unavailable || errorMessages.zh.service_unavailable;
            statusCode = 503;
        } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
            errorType = 'auth_error';
            userMessage = errorMessages[language]?.auth_error || errorMessages.zh.auth_error;
            statusCode = 401;
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
            errorType = 'quota_exceeded';
            userMessage = errorMessages[language]?.quota_exceeded || errorMessages.zh.quota_exceeded;
            statusCode = 429;
        } else {
            userMessage = errorMessages[language]?.default || errorMessages.zh.default;
        }
        
        res.status(statusCode).json({ 
            error: userMessage,
            errorType: errorType,
            details: error.message 
        });
    }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        azureConfig: {
            endpoint: endpoint,
            model: model,
            hasToken: !!token
        }
    });
});

// 所有其他路由都返回前端应用
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📱 前端应用: http://localhost:${PORT}`);
    console.log(`🔧 健康检查: http://localhost:${PORT}/api/health`);
    
    // 检查Azure AI配置
    if (!token) {
        console.warn('⚠️  警告: 未设置GITHUB_TOKEN环境变量');
        console.warn('   请设置环境变量以使用Azure AI功能');
    }
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭服务器...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 正在关闭服务器...');
    process.exit(0);
});
