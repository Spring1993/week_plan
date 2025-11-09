const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { action, data } = event;
  
  try {
    if (action === 'get') {
      // 读取数据
      const res = await db.collection('weekend_plans').doc('public').get();
      if (res.data && res.data.length > 0) {
        return { success: true, data: res.data[0] };
      } else {
        return { success: true, data: null };
      }
    } else if (action === 'save') {
      // 保存数据
      try {
        await db.collection('weekend_plans').doc('public').set({
          data: {
            _id: 'public',
            plans: data.plans,
            schedule: data.schedule,
            updatedAt: Date.now()
          }
        });
      } catch (e) {
        // 如果 set 失败，尝试 update
        await db.collection('weekend_plans').doc('public').update({
          data: {
            plans: data.plans,
            schedule: data.schedule,
            updatedAt: Date.now()
          }
        });
      }
      return { success: true };
    } else {
      return { success: false, error: 'Invalid action' };
    }
  } catch (e) {
    console.error('Function error:', e);
    return { success: false, error: e.message };
  }
};
