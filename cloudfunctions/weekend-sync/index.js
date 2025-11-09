const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { action, data } = event;
  
  try {
    if (action === 'get') {
      // 读取数据
      const res = await db.collection('weekend_plans').doc('public').get();
      return { success: true, data: res.data };
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
      return { success: true };
    }
  } catch (e) {
    return { success: false, error: e.message };
  }
};
