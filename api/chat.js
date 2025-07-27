// api/chat.js - Vercel无服务器函数
export default async function handler(req, res) {
  // 设置CORS头部，允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  try {
    const { message } = req.body;
    
    // 验证输入
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: '请输入有效的消息' });
    }

    // 这里调用大模型API
    const response = await callAIModel(message);
    
    res.status(200).json({ 
      success: true, 
      reply: response 
    });

  } catch (error) {
    console.error('AI调用失败:', error);
    res.status(500).json({ 
      error: '服务器内部错误，请稍后重试' 
    });
  }
}

// AI模型调用函数 - 这里使用OpenAI作为示例
async function callAIModel(userMessage) {
  const systemPrompt = `你是王皓辰的AI助手。王皓辰是一位AI产品经理，在腾讯负责AI大模型应用开发，有3年AI产品经验。
  
关于王皓辰的基本信息：
- 职业：AI产品经理 / 腾讯AI大模型应用
- 教育：陕西科技大学产品设计专业毕业（2018-2022）
- 经验：3年AI产品经验，国内首批AI产品经理
- 成就：产品日活量3W+，获得过德国IF设计奖、中国设计智造大奖DIA、台湾两岸新锐设计华灿奖全国二等奖、知识产权杯全国大学生工业设计大赛一等奖、互联网+全国大学生全国二等奖等多个奖项
- 技能：AI大模型训练、AI产品管理、UI/UX设计、产品设计、市场分析
- 特点：有较强的市场意识，具备出色的市场调研、需求分析、数据分析等能力，结果导向，具备优秀的跨部门沟通能力、团队合作能力、项目管理能力及优秀的学习能力

请以友好专业的语气回答用户的问题，如果被问到不了解的具体技术细节，可以诚实地说明。回答要简洁明了，控制在200字以内。`;

  // 测试模式：如果没有API密钥，返回预设回复
  if (!process.env.OPENAI_API_KEY) {
    return getTestResponse(userMessage);
  }

  try {
    // 使用OpenAI API示例
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-v3',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API请求失败: ${openaiResponse.status}`);
    }

    const data = await openaiResponse.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('调用AI模型失败:', error);
    
    // 如果AI调用失败，返回一个友好的fallback回复
    const fallbackResponses = [
      '感谢你的提问！我是王皓辰的AI助手，虽然现在暂时无法给出详细回答，但你可以通过页面底部的联系方式直接与王皓辰取得联系。',
      '抱歉，我现在遇到了一些技术问题。如果你对王皓辰的工作经历或AI产品相关问题感兴趣，建议你直接联系他本人。',
      '目前AI服务暂时不可用，但你可以浏览页面了解王皓辰的教育背景、获奖经历和工作经验。有任何问题也可以通过底部的联系方式联系他。'
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}

// 测试模式回复函数
function getTestResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // 根据关键词匹配返回相应回复
  if (message.includes('你好') || message.includes('hello') || message.includes('hi')) {
    return '你好！我是王皓辰的AI助手。很高兴认识你！我可以回答关于王皓辰的工作经历、技能、项目经验等问题。有什么想了解的吗？';
  }
  
  if (message.includes('工作') || message.includes('职业') || message.includes('经历')) {
    return '王皓辰目前是腾讯的AI产品经理，专注于AI大模型应用开发。他有3年的AI产品经验，是国内首批AI产品经理之一。他负责的产品日活用户超过3万，具备优秀的跨部门沟通和项目管理能力。';
  }
  
  if (message.includes('教育') || message.includes('学历') || message.includes('大学')) {
    return '王皓辰毕业于陕西科技大学产品设计专业（2018-2022年）。陕西科技大学是全国88所重点院校之一，也是陕西省国家"双一流"培育高校。';
  }
  
  if (message.includes('获奖') || message.includes('奖项') || message.includes('成就')) {
    return '王皓辰获得了多个重要奖项，包括：德国IF设计奖、中国设计智造大奖DIA、台湾两岸新锐设计华灿奖全国二等奖、知识产权杯全国大学生工业设计大赛一等奖、互联网+全国大学生全国二等奖等。这些奖项体现了他在设计和创新方面的卓越能力。';
  }
  
  if (message.includes('技能') || message.includes('能力') || message.includes('专长')) {
    return '王皓辰的核心技能包括：AI大模型训练、AI产品管理、UI/UX设计、产品设计和市场分析。他具备较强的市场意识和出色的市场调研、需求分析、数据分析能力，是一个结果导向的产品经理。';
  }
  
  if (message.includes('联系') || message.includes('合作') || message.includes('招聘')) {
    return '如果你想与王皓辰联系或了解合作机会，可以通过页面底部的联系方式与他取得联系。他很乐意与同行交流AI产品相关的话题！';
  }
  
  if (message.includes('ai') || message.includes('人工智能') || message.includes('大模型')) {
    return '王皓辰在AI领域有丰富经验，特别是在大语言模型类产品方面。他参与过多个AI产品的从0到1开发，对AI技术如何转化为实际的用户价值有深入理解。如果你对AI产品开发感兴趣，可以与他深入交流！';
  }
  
  // 默认回复
  return '感谢你的提问！我是王皓辰的AI助手，目前正在测试模式下运行。你可以问我关于王皓辰的工作经历、教育背景、获奖情况、技能专长等问题。或者你也可以通过页面底部的联系方式直接与他联系！';
}
