const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init({ env: cloudbase.SYMBOL_CURRENT_ENV });
const db = app.database();

exports.main = async (req, res) => {
  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).send('');
    return;
  }

  try {
    const { action, data } = req.body || {};
    
    if (action === 'get') {
      // 读取数据
      const result = await db.collection('weekend_plans').doc('public').get();
      if (result.data && result.data.length > 0) {
        res.status(200).json({ success: true, data: result.data[0] });
      } else {
        res.status(200).json({ success: true, data: null });
      }
    } else if (action === 'save') {
      // 保存数据
      try {
        await db.collection('weekend_plans').doc('public').set({
          _id: 'public',
          plans: data.plans,
          schedule: data.schedule,
          updatedAt: Date.now()
        });
      } catch (e) {
        // 如果文档不存在，用 add 创建
        await db.collection('weekend_plans').add({
          _id: 'public',
          plans: data.plans,
          schedule: data.schedule,
          updatedAt: Date.now()
        });
      }
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, error: 'Invalid action' });
    }
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ success: false, error: e.message });
  }
};

