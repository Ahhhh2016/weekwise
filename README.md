# WeekWise - AI驱动的周训练计划应用

<p align="center">
  <img width="751" height="421" alt="image" src="https://github.com/user-attachments/assets/377dd339-6a57-48d7-b819-f31f2610cbb9" />
</p>

一个由 AI 驱动的周训练计划生成与打印工具，通过对话制定个性化的每周训练计划，支持编辑和打印功能，帮助你保持节奏、坚持目标。
访问网站：[https://weekwise-trainingplan.vercel.app/](https://weekwise-trainingplan.vercel.app/)

## 功能特性

- 🤖 **AI健身教练助手** - 使用GitHub AI生成个性化训练计划
- 📅 **周训练计划** - 7天完整的训练安排
- ✏️ **可编辑内容** - 点击即可编辑训练内容、时长和备注
- ✅ **进度跟踪** - 每日完成状态标记
- 🖨️ **打印友好** - 优化的打印样式，支持A4纸张
- 🌐 **中英文切换** - 一键切换界面语言，支持 English / 中文


## 技术栈

### 前端
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui 组件库
- React Router

### 后端
- Node.js + Express
- GitHub AI API
- CORS支持

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

编辑 `.env` 文件，添加你的GitHub AI Token：
```env
GITHUB_TOKEN=your_github_token_here
PORT=3001
```

### 3. 启动开发服务器

#### 方式一：同时启动前后端（推荐）
```bash
npm run dev:full
```

#### 方式二：分别启动
```bash
# 终端1：启动后端服务器
npm run dev:server

# 终端2：启动前端开发服务器
npm run dev
```

### 4. 访问应用

- 前端应用：http://localhost:8080
- 后端API：http://localhost:3001
- 健康检查：http://localhost:3001/api/health

## 使用指南

### 生成训练计划
1. 描述你的健身目标、经验水平、可用时间等信息
2. AI会生成个性化的周训练计划
3. 生成后点击“打印周训练计划“按钮，跳转到新的页面

### 编辑训练计划

- 点击任意训练内容、时长或备注区域进行编辑
- 点击标题可以修改训练计划名称
- 使用复选框标记每日完成状态

### 打印训练计划

- 点击右上角的🖨️按钮或使用快捷键 Ctrl+P
- 页面已优化为A4纸张打印格式

## API端点

### 聊天API
```
POST /api/chat
Content-Type: application/json

{
  "message": "用户消息",
  "history": [聊天历史]
}
```

### 生成训练计划API
```
POST /api/generate-plan
Content-Type: application/json

{
  "prompt": "训练计划描述"
}
```

### 健康检查API
```
GET /api/health
```

## 项目结构

```
weekwise/
├── src/                    # 前端源代码
│   ├── components/         # React组件
│   ├── pages/             # 页面组件
│   ├── lib/               # 工具库和API服务
│   └── hooks/             # 自定义Hooks
├── server/                # 后端服务器
│   └── index.js           # Express服务器
├── public/                # 静态资源
└── dist/                  # 构建输出
```

## 开发说明

### 添加新的API端点

1. 在 `server/index.js` 中添加新的路由
2. 在 `src/lib/api.ts` 中添加对应的API服务方法
3. 在前端组件中调用API服务

### 自定义训练计划格式

修改 `server/index.js` 中的 `TRAINING_PLAN_PROMPT` 来调整AI生成的内容格式。

## 部署

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm run dev:server
```

## 故障排除

### 常见问题

1. **AI功能不工作**
   - 检查 `.env` 文件中的 `GITHUB_TOKEN` 是否正确设置
   - 确认网络连接正常

2. **前端无法连接后端**
   - 确认后端服务器在3001端口运行
   - 检查Vite代理配置

3. **打印样式问题**
   - 使用Chrome或Edge浏览器
   - 确保启用了打印背景颜色选项

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License

## 待开发功能
- [ ] 移动端适配
- [ ] 英文训练计划生成

---

# WeekWise - AI-Powered Weekly Training Plan App

An AI-powered tool for generating and printing personalized weekly training plans. Through natural conversation, you can design a tailored weekly workout schedule, edit it, and print it — helping you stay consistent and reach your fitness goals.
Visit the website: [https://weekwise-trainingplan.vercel.app/](https://weekwise-trainingplan.vercel.app/)

## Features

- 🤖 AI Fitness Coach – Uses GitHub AI to generate personalized training plans
- 📅 Weekly Training Schedule – A complete 7-day workout routine with training tips and key strategies
- ✏️ Editable Content – Click to modify exercises, duration, and notes
- ✅ Progress Tracking – Mark your daily completion status
- 🖨️ Print-Friendly Design – Optimized layout for A4 printing 
- 🌐 Bilingual Interface – One-click switch between English / 中文

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui component library
- React Router

### Backend

- Node.js + Express
- GitHub AI API
- CORS support

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Environment setup

Edit the `.env` file and add your GitHub AI Token:

```
GITHUB_TOKEN=your_github_token_here
PORT=3001
```

### 3. Start the development servers
#### Option 1: Start both frontend and backend together (recommended)
```bash
npm run dev:full
```

#### Option 2: Start them separately
```bash
# Terminal 1: Start the backend server
npm run dev:server

# Terminal 2: Start the frontend dev server
npm run dev
```

### 4. Access the app

Frontend: http://localhost:8080
Backend API: http://localhost:3001
Health check: http://localhost:3001/api/health

## User Guide

### Generate a training plan

1. Describe your fitness goals, experience level, and available time.
2. The AI will generate a personalized weekly plan.
3. After generation, click the “Print Weekly Plan” button to open the printable view.

### Edit your training plan

- Click any exercise, duration, or note to edit it directly.
- Click the title to rename the plan.
- Use checkboxes to mark daily completion.

### Print your training plan
- Click the 🖨️ button at the top right or press Ctrl+P.
- The page is optimized for A4 paper printing.

## API Endpoints
### Chat API

```
POST /api/chat
Content-Type: application/json

{
  "message": "用户消息",
  "history": [聊天历史]
}
```

### Generate Training Plan API
```
POST /api/generate-plan
Content-Type: application/json

{
  "prompt": "训练计划描述"
}
```

### Health Check
```
GET /api/health
```

## Project Structure
```
weekwise/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and API services
│   └── hooks/              # Custom React hooks
├── server/                 # Backend server
│   └── index.js            # Express server entry point
├── public/                 # Static assets
└── dist/                   # Build output
```

## Development Guide
### Adding a new API endpoint
1. Add a new route in server/index.js
2. Add the corresponding API function in src/lib/api.ts
3. Call the API function from your frontend component

### Customizing the training plan format

Modify the TRAINING_PLAN_PROMPT in server/index.js to adjust how the AI structures the generated content.

### Deployment
Build for production
```bash
npm run build
```

Start the production server
```
npm run dev:server
```

## Troubleshooting
### Common Issues

1. AI features not working

- Check whether your GITHUB_TOKEN in .env is correctly set
- Ensure your network connection is stable

2. Frontend cannot connect to backend

- Make sure the backend server is running on port 3001
- Check your Vite proxy configuration

3. Printing layout issues

- Use Chrome or Edge browsers
- Make sure “Print Background Colors” is enabled

## Contributing

Contributions are welcome!
Please submit Issues or Pull Requests to help improve this project.

## License

MIT License

## Features To Be Implemented

-[ ] Mobile adaptation
-[ ] English-based training plan generation
