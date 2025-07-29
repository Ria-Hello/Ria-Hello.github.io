/**
 * 阿里云函数计算 - 联系表单处理函数
 * 处理来自个人网站联系表单的消息
 */

exports.handler = async (req, resp, context) => {
    // 记录请求日志
    console.log('收到请求:', {
        method: req.method,
        path: req.path,
        headers: req.headers
    });

    // 设置 CORS 头，允许前端跨域访问
    const headers = {
        'Access-Control-Allow-Origin': '*', // 生产环境建议设置为具体域名
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Content-Type': 'application/json; charset=utf-8'
    };

    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
        resp.setStatusCode(200);
        resp.setHeaders(headers);
        resp.send('');
        return;
    }

    // 只允许 POST 请求
    if (req.method !== 'POST') {
        resp.setStatusCode(405);
        resp.setHeaders(headers);
        resp.send(JSON.stringify({
            success: false,
            message: '只允许 POST 请求'
        }));
        return;
    }

    try {
        // 解析请求体
        let body;
        try {
            const rawBody = req.body?.toString() || '{}';
            body = JSON.parse(rawBody);
        } catch (parseError) {
            console.error('解析请求体失败:', parseError);
            resp.setStatusCode(400);
            resp.setHeaders(headers);
            resp.send(JSON.stringify({
                success: false,
                message: '请求格式错误'
            }));
            return;
        }

        // 提取表单数据
        const { name, email, message, timestamp, source } = body;

        // 验证必需字段
        const errors = [];
        if (!name || name.trim().length === 0) {
            errors.push('姓名不能为空');
        }
        if (!email || email.trim().length === 0) {
            errors.push('邮箱不能为空');
        }
        if (!message || message.trim().length === 0) {
            errors.push('消息内容不能为空');
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email.trim())) {
            errors.push('邮箱格式不正确');
        }

        // 如果有验证错误，返回错误信息
        if (errors.length > 0) {
            resp.setStatusCode(400);
            resp.setHeaders(headers);
            resp.send(JSON.stringify({
                success: false,
                message: '数据验证失败',
                errors: errors
            }));
            return;
        }

        // 数据清理
        const cleanData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            timestamp: timestamp || new Date().toISOString(),
            source: source || 'personal-website',
            ip: req.headers['x-forwarded-for'] || req.clientIP || 'unknown'
        };

        // 记录收到的消息
        console.log('收到联系表单消息:', {
            name: cleanData.name,
            email: cleanData.email,
            messageLength: cleanData.message.length,
            timestamp: cleanData.timestamp,
            ip: cleanData.ip
        });

        // 这里可以添加更多业务逻辑
        // 1. 保存到数据库
        // await saveToDatabase(cleanData);
        
        // 2. 发送邮件通知
        // await sendEmailNotification(cleanData);
        
        // 3. 发送到钉钉/微信等
        // await sendToNotificationService(cleanData);

        // 模拟处理时间（可选）
        // await new Promise(resolve => setTimeout(resolve, 100));

        // 返回成功响应
        resp.setStatusCode(200);
        resp.setHeaders(headers);
        resp.send(JSON.stringify({
            success: true,
            message: '消息发送成功！感谢您的联系，我会尽快回复。',
            data: {
                timestamp: cleanData.timestamp,
                messageId: generateMessageId()
            }
        }));

    } catch (error) {
        console.error('处理请求时出错:', error);
        
        resp.setStatusCode(500);
        resp.setHeaders(headers);
        resp.send(JSON.stringify({
            success: false,
            message: '服务器内部错误，请稍后重试',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }));
    }
};

/**
 * 生成消息 ID
 */
function generateMessageId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `msg_${timestamp}_${random}`;
}

/**
 * 保存到数据库（示例）
 * 你可以使用阿里云的表格存储、RDS 等服务
 */
async function saveToDatabase(data) {
    // 示例：使用阿里云表格存储 (Tablestore)
    // const TableStore = require('tablestore');
    // const client = new TableStore.Client({
    //     accessKeyId: process.env.ACCESS_KEY_ID,
    //     secretAccessKey: process.env.SECRET_ACCESS_KEY,
    //     endpoint: process.env.TABLESTORE_ENDPOINT,
    //     instancename: process.env.TABLESTORE_INSTANCE
    // });
    
    // const params = {
    //     tableName: 'contact_messages',
    //     condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
    //     primaryKey: [
    //         { 'id': generateMessageId() },
    //         { 'timestamp': new Date().getTime() }
    //     ],
    //     attributeColumns: [
    //         { 'name': data.name },
    //         { 'email': data.email },
    //         { 'message': data.message },
    //         { 'ip': data.ip },
    //         { 'source': data.source }
    //     ]
    // };
    
    // return await client.putRow(params);
    
    console.log('数据库保存功能待实现');
}

/**
 * 发送邮件通知（示例）
 * 你可以使用阿里云邮件推送服务
 */
async function sendEmailNotification(data) {
    // 示例：使用阿里云邮件推送
    // const Core = require('@alicloud/pop-core');
    
    // const client = new Core({
    //     accessKeyId: process.env.ACCESS_KEY_ID,
    //     accessKeySecret: process.env.SECRET_ACCESS_KEY,
    //     endpoint: 'https://dm.aliyuncs.com',
    //     apiVersion: '2015-11-23'
    // });

    // const params = {
    //     "RegionId": "cn-hangzhou",
    //     "AccountName": "noreply@yourdomain.com",
    //     "FromAlias": "个人网站",
    //     "AddressType": 1,
    //     "TagName": "contact-form",
    //     "ReplyToAddress": "true",
    //     "ToAddress": "your-email@example.com",
    //     "Subject": `新的联系表单消息 - ${data.name}`,
    //     "HtmlBody": `
    //         <h2>收到新的联系表单消息</h2>
    //         <p><strong>姓名：</strong>${data.name}</p>
    //         <p><strong>邮箱：</strong>${data.email}</p>
    //         <p><strong>时间：</strong>${data.timestamp}</p>
    //         <p><strong>IP：</strong>${data.ip}</p>
    //         <p><strong>消息内容：</strong></p>
    //         <div style="background:#f5f5f5;padding:15px;border-radius:5px;">
    //             ${data.message.replace(/\n/g, '<br>')}
    //         </div>
    //     `
    // };

    // const requestOption = {
    //     method: 'POST'
    // };

    // return await client.request('SingleSendMail', params, requestOption);
    
    console.log('邮件发送功能待实现');
} 