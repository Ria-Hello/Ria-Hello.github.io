# 个人网站项目

这是一个现代化的个人网站项目，采用前后端分离的架构：
- **前端**：静态 HTML/CSS/JavaScript，部署在 GitHub Pages
- **后端**：阿里云函数计算 (FC)，处理联系表单等动态功能

## 📁 项目结构

```
persoal_website/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── script.js       # JavaScript 脚本
├── README.md           # 项目说明
└── example/            # 示例文件夹
```

## ✨ 功能特点

- 🎨 现代化响应式设计
- 📱 移动端友好
- 🚀 快速加载
- 💌 联系表单（连接阿里云 FC）
- 🎯 平滑滚动导航
- ✨ 动画效果
- 🔧 易于定制

## 🛠️ 本地开发

1. **克隆项目到本地**
   ```bash
   git clone https://github.com/yourusername/persoal_website.git
   cd persoal_website
   ```

2. **本地预览**
   - 方式一：直接双击 `index.html` 文件
   - 方式二：使用 Live Server（推荐）
     ```bash
     # 如果使用 VS Code，安装 Live Server 扩展
     # 右键 index.html -> Open with Live Server
     ```
   - 方式三：使用 Python 简单服务器
     ```bash
     # Python 3
     python -m http.server 8000
     # 然后访问 http://localhost:8000
     ```

## 🚀 部署到 GitHub Pages

1. **创建 GitHub 仓库**
   - 在 GitHub 上创建新仓库
   - 将代码推送到仓库

2. **启用 GitHub Pages**
   - 进入仓库的 Settings
   - 找到 Pages 选项
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "main" 或 "master"
   - 点击 Save

3. **访问网站**
   - GitHub 会提供一个网址：`https://yourusername.github.io/repository-name`

## ☁️ 阿里云函数计算 (FC) 后端配置

### 创建函数

1. **登录阿里云控制台**
   - 进入函数计算 FC 服务

2. **创建服务和函数**
   - 创建新服务（例如：`personal-website`）
   - 创建新函数（例如：`contact-handler`）
   - 运行时选择 `Node.js 14` 或 `Python 3.9`

### 函数代码示例（Node.js）

```javascript
// index.js
exports.handler = async (req, resp, context) => {
    // 设置 CORS 头
    const headers = {
        'Access-Control-Allow-Origin': 'https://yourusername.github.io',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // 处理 OPTIONS 请求（预检请求）
    if (req.method === 'OPTIONS') {
        resp.setStatusCode(200);
        resp.setHeaders(headers);
        resp.send('');
        return;
    }

    try {
        // 解析请求体
        const body = JSON.parse(req.body.toString());
        const { name, email, message, timestamp } = body;

        // 验证数据
        if (!name || !email || !message) {
            resp.setStatusCode(400);
            resp.setHeaders(headers);
            resp.send(JSON.stringify({
                success: false,
                message: '缺少必需字段'
            }));
            return;
        }

        // 这里可以添加你的业务逻辑
        // 例如：发送邮件、保存到数据库等
        console.log('收到联系表单:', { name, email, message, timestamp });

        // 返回成功响应
        resp.setStatusCode(200);
        resp.setHeaders(headers);
        resp.send(JSON.stringify({
            success: true,
            message: '消息发送成功'
        }));

    } catch (error) {
        console.error('处理请求时出错:', error);
        resp.setStatusCode(500);
        resp.setHeaders(headers);
        resp.send(JSON.stringify({
            success: false,
            message: '服务器内部错误'
        }));
    }
};
```

### 配置触发器

1. **创建 HTTP 触发器**
   - 认证方式：anonymous（匿名访问）
   - 请求方法：POST, OPTIONS
   - 记录触发器的 URL

2. **更新前端配置**
   - 在 `js/script.js` 中找到 `fcEndpoint` 变量
   - 替换为你的 FC 函数 URL

```javascript
// 在 js/script.js 中更新这行
const fcEndpoint = 'https://your-account-id.region.fc.aliyuncs.com/2016-08-15/proxy/your-service/your-function/';
```

## 🎨 定制指南

### 修改个人信息

1. **基本信息**
   - 编辑 `index.html` 中的姓名、职业、描述等
   - 更新联系方式（邮箱、GitHub、LinkedIn）

2. **技能和项目**
   - 在 `index.html` 中更新技能卡片
   - 添加或修改项目展示

3. **样式定制**
   - 修改 `css/style.css` 中的颜色、字体等
   - 主要变量在文件顶部

### 添加新页面

如果需要添加博客、作品集等页面：

1. 创建新的 HTML 文件
2. 在导航栏中添加链接
3. 保持样式一致性

## 📧 联系表单集成

### 邮件发送选项

1. **阿里云邮件推送**
   ```javascript
   // 在 FC 函数中集成阿里云邮件推送服务
   ```

2. **第三方邮件服务**
   - SendGrid
   - Mailgun
   - 腾讯云邮件服务

3. **简单方案**
   - 使用 Formspree 等第三方表单服务

## 🔧 故障排除

### 常见问题

1. **GitHub Pages 部署失败**
   - 检查仓库设置
   - 确保 index.html 在根目录

2. **联系表单不工作**
   - 检查 FC 函数 URL 是否正确
   - 查看浏览器控制台错误
   - 检查 CORS 配置

3. **样式显示异常**
   - 检查文件路径是否正确
   - 确保 CSS 文件加载成功

### 调试技巧

1. **浏览器开发者工具**
   - F12 打开开发者工具
   - 查看 Console 面板的错误信息
   - 检查 Network 面板的请求状态

2. **FC 函数调试**
   - 查看函数计算控制台的日志
   - 使用 console.log 输出调试信息

## 📝 更新日志

- v1.0.0: 初始版本，包含基本功能
- 后续版本将添加更多功能...

## 📄 许可证

MIT License - 可自由使用和修改

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

如果你在使用过程中遇到问题，欢迎通过网站联系表单或 GitHub Issue 联系我！ 