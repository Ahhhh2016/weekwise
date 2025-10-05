# WeekWise - AI驱动的周训练计划应用

一个现代化的健身训练计划应用，集成了AI助手来生成个性化的周训练计划。

## 功能特性

- 🤖 **AI健身教练助手** - 使用GitHub AI生成个性化训练计划
- 📅 **周训练计划** - 7天完整的训练安排
- ✏️ **可编辑内容** - 点击即可编辑训练内容、时长和备注
- ✅ **进度跟踪** - 每日完成状态标记
- 🖨️ **打印友好** - 优化的打印样式，支持A4纸张
- 🎨 **现代UI** - 基于shadcn/ui的美观界面
- 📱 **响应式设计** - 适配各种屏幕尺寸

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

复制环境变量示例文件：
```bash
cp env.example .env
```

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

1. 点击训练计划页面右上角的🤖按钮打开AI助手
2. 描述你的健身目标、经验水平、可用时间等信息
3. AI会生成个性化的周训练计划
4. 训练计划会自动更新到页面上

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