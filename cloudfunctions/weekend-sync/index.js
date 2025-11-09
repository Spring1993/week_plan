const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  // 处理 CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: ''
    };
  }

  try {
    // 解析请求体
    let body = event.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    
    const { action, data } = body || event;
    
    let result;
    if (action === 'get') {
      // 读取数据
      const res = await db.collection('weekend_plans').doc('public').get();
      result = { success: true, data: res.data };
    } else if (action === 'set') {
      // 保存数据
      await db.collection('weekend_plans').doc('public').set({
        data: {
          _id: 'public',
          plans: data.plans,
          schedule: data.schedule,
          updatedAt: Date.now()
        }
      });
      result = { success: true };
    } else {
      result = { success: false, error: 'Invalid action' };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result)
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: false, error: e.message })
    };
  }
};
