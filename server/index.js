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
const TRAINING_PLAN_PROMPT = `你是一个专业的健身教练和训练计划制定专家。请根据用户的需求生成一个详细的周训练计划。

要求：
1. 生成一个7天的训练计划，包含每天的具体训练内容
2. 每个训练日包含：训练内容、时长、重点/备注
3. 训练内容要平衡力量训练、有氧训练和恢复
4. 考虑用户的健身水平和可用时间
5. 提供实用的训练提示和策略建议
6. 使用中文回复，语言要专业但易懂

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
      "训练提示1",
      "训练提示2"
    ],
    "strategies": [
      {
        "title": "策略标题",
        "description": "策略描述"
      }
    ]
  }
}`;

// 聊天API端点
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: '消息内容不能为空' });
        }

        // 构建消息历史
        const messages = [
            { role: "system", content: TRAINING_PLAN_PROMPT },
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
        res.status(500).json({ 
            error: '服务器内部错误',
            details: error.message 
        });
    }
});

// 生成训练计划API端点
app.post('/api/generate-plan', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        const messages = [
            { 
                role: "system", 
                content: TRAINING_PLAN_PROMPT 
            },
            { 
                role: "user", 
                content: prompt || "请生成一个通用的周训练计划" 
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
        res.status(500).json({ 
            error: '生成训练计划失败',
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
