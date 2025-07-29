# 🚀 快速开始指南

这个指南将帮你在 10 分钟内部署一个完整的个人网站！

## 📋 前提条件

- 有一个 GitHub 账号
- 有一个阿里云账号（可选，用于联系表单功能）
- 基本的 Git 操作知识

## 🎯 第一步：部署前端（GitHub Pages）

### 1.1 本地测试
```bash
# 进入项目目录
cd persoal_website

# 直接用浏览器打开 index.html 文件
# 或者用 VS Code 的 Live Server 扩展
```

### 1.2 修改个人信息
编辑 `index.html` 文件：
```html
<!-- 修改这些地方 -->
<h1 class="hero-title">你好，我是 <span class="highlight">你的名字</span></h1>
<p class="hero-subtitle">你的职业</p>

<!-- 更新联系方式 -->
<span>your.email@example.com</span>
<span>github.com/yourusername</span>
```

### 1.3 部署到 GitHub Pages
```bash
# 1. 创建 GitHub 仓库
# 在 GitHub 上创建新仓库，比如叫 "my-personal-website"

# 2. 初始化本地仓库
git init
git add .
git commit -m "Initial commit: 个人网站静态页面"

# 3. 连接到 GitHub 仓库
git remote add origin https://github.com/yourusername/my-personal-website.git
git branch -M main
git push -u origin main

# 4. 在 GitHub 仓库设置中启用 Pages
# Settings -> Pages -> Source: Deploy from a branch -> main -> Save
```

🎉 **恭喜！** 你的网站现在可以通过 `https://yourusername.github.io/my-personal-website` 访问了！

## ☁️ 第二步：部署后端（阿里云 FC）[可选]

如果你想要联系表单功能，可以继续配置后端。

### 2.1 登录阿里云控制台
1. 访问 [阿里云函数计算控制台](https://fc.console.aliyun.com/)
2. 选择一个地域（推荐：华东1(杭州)）

### 2.2 创建服务和函数
```bash
# 在阿里云 FC 控制台操作：

1. 点击"创建服务"
   - 服务名称：personal-website
   - 描述：个人网站后端服务
   - 点击"创建"

2. 在服务中点击"创建函数"
   - 函数名称：contact-handler
   - 运行时：Node.js 14
   - 函数入口：index.handler
   - 内存规格：128 MB
   - 执行超时时间：10 秒
```

### 2.3 上传函数代码
1. 将 `fc-backend/index.js` 的内容复制到函数编辑器中
2. 点击"部署代码"

### 2.4 创建 HTTP 触发器
```bash
1. 在函数详情页，点击"创建触发器"
2. 配置参数：
   - 触发器类型：HTTP 触发器
   - 触发器名称：http-trigger
   - 认证方式：anonymous
   - 请求方法：POST, OPTIONS
   - 点击"确定"

3. 记录触发器 URL，类似：
   https://1234567890.cn-hangzhou.fc.aliyuncs.com/2016-08-15/proxy/personal-website/contact-handler
```

### 2.5 更新前端配置
编辑 `js/script.js` 文件：
```javascript
// 找到这一行，替换为你的 FC 函数 URL
const fcEndpoint = 'https://你的FC函数URL';
```

### 2.6 重新部署前端
```bash
git add .
git commit -m "连接阿里云 FC 后端"
git push
```

## 🧪 第三步：测试功能

### 3.1 测试网站访问
- 访问你的 GitHub Pages 网址
- 检查各个页面部分是否正常显示
- 测试响应式设计（用手机浏览器访问）

### 3.2 测试联系表单
1. 填写联系表单
2. 点击"发送消息"
3. 检查是否显示成功消息

### 3.3 调试问题
如果有问题：
```bash
# 查看浏览器控制台
F12 -> Console 面板

# 查看阿里云 FC 日志
在 FC 控制台 -> 函数详情 -> 调用日志
```

## 🎨 第四步：个性化定制

### 4.1 修改颜色主题
编辑 `css/style.css`：
```css
/* 找到这些变量并修改 */
:root {
    --primary-color: #2563eb;    /* 主色调 */
    --secondary-color: #fbbf24;  /* 辅助色 */
    --text-color: #333;          /* 文字颜色 */
}
```

### 4.2 添加项目
在 `index.html` 中添加更多项目卡片：
```html
<div class="project-card">
    <div class="project-image">
        <i class="fas fa-code"></i>
    </div>
    <div class="project-content">
        <h3>你的项目名称</h3>
        <p>项目描述...</p>
        <!-- ... -->
    </div>
</div>
```

### 4.3 更新技能
修改技能卡片的内容和图标。

## 🔧 高级配置

### 启用邮件通知
如果你想收到邮件通知，可以在阿里云 FC 函数中启用邮件推送：

1. 开通阿里云邮件推送服务
2. 在 FC 函数中取消注释邮件发送代码
3. 配置环境变量

### 添加访问统计
可以集成百度统计、Google Analytics 等：
```html
<!-- 在 index.html 的 </head> 前添加统计代码 -->
```

### 自定义域名
1. 在 GitHub Pages 设置中配置自定义域名
2. 在你的域名 DNS 中添加 CNAME 记录

## 🔍 故障排除

### 常见问题

**Q: GitHub Pages 网站打不开**
```bash
A: 检查仓库设置 -> Pages -> Source 是否正确配置
```

**Q: 联系表单发送失败**
```bash
A: 
1. 检查 FC 函数 URL 是否正确
2. 查看浏览器控制台错误
3. 检查 FC 函数日志
```

**Q: 样式显示异常**
```bash
A: 
1. 检查文件路径是否正确
2. 清除浏览器缓存
3. 检查 CSS 文件是否加载成功
```

### 获得帮助

如果遇到问题：
1. 查看项目的 README.md 文件
2. 检查浏览器开发者工具
3. 查看阿里云 FC 控制台日志
4. 在 GitHub 仓库中提交 Issue

## 🎉 完成！

恭喜你！现在你有了一个：
- ✅ 现代化的个人网站
- ✅ 响应式设计
- ✅ 联系表单功能
- ✅ 部署在 GitHub Pages
- ✅ 后端使用阿里云 FC

接下来你可以：
- 📝 定期更新项目展示
- 🎨 调整设计和布局
- 📧 添加更多功能
- 📈 分析访问数据

**祝你的个人网站越来越棒！** 🌟 