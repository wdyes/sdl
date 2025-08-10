// 初始化菜单数据
export const initMenuData = () => {
  const storedMenu = uni.getStorageSync('menuData');
  if (!storedMenu) {
    // 如果本地存储中没有菜单数据，初始化一个默认菜单
    const defaultMenu = {
      dishes: [
        { id: 1, name: '糖醋排骨', price: 38, image: '/static/dishes/tangcupaigu.jpg' },
        { id: 2, name: '西红柿炒鸡蛋', price: 18, image: '/static/dishes/xihongshichaojidan.jpg' }
      ]
    };
    uni.setStorageSync('menuData', JSON.stringify(defaultMenu));
    return defaultMenu;
  }
  return JSON.parse(storedMenu);
};

// 保存菜单数据到本地存储
export const saveMenuData = (data: any) => {
  uni.setStorageSync('menuData', JSON.stringify(data));
};

// 初始化订单数据
export const initOrderData = () => {
  const storedOrder = uni.getStorageSync('orderData');
  if (!storedOrder) {
    // 如果本地存储中没有订单数据，初始化一个空订单
    const defaultOrder = { items: [] };
    uni.setStorageSync('orderData', JSON.stringify(defaultOrder));
    return defaultOrder;
  }
  return JSON.parse(storedOrder);
};

// 保存订单数据到本地存储
export const saveOrderData = (data: any) => {
  uni.setStorageSync('orderData', JSON.stringify(data));
};

// 初始化每日食谱数据
// 修改initRecipeData函数
export const initRecipeData = (): Record<string, { items: any[] }> => {
  const storedRecipe = uni.getStorageSync('recipeData');
  if (storedRecipe) {
    try {
      return JSON.parse(storedRecipe) as Record<string, { items: any[] }>;
    } catch (e) {
      console.error('解析食谱数据失败:', e);
      return {};
    }
  }
  return {};
};

// 修改saveRecipeData函数
export const saveRecipeData = (data: any) => {
  // 保留旧版接口，默认保存到今天
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayDate = `${year}-${month}-${day}`;
  
  const allRecipeData = initRecipeData();
  allRecipeData[todayDate] = data;
  uni.setStorageSync('recipeData', JSON.stringify(allRecipeData));
};

// 添加新函数用于按日期保存
// 修改saveRecipeDataByDate函数
export const saveRecipeDataByDate = (date: string, data: any) => {
  // 验证数据格式
  if (!date || !data || !Array.isArray(data.items)) {
    console.error('保存食谱数据失败：无效的数据格式');
    return;
  }
  
  const allRecipeData = initRecipeData();
  allRecipeData[date] = data;
  uni.setStorageSync('recipeData', JSON.stringify(allRecipeData));
};

// 添加按日期获取食谱数据的函数
export const getRecipeDataByDate = (date: string) => {
  const allRecipeData = initRecipeData();
  return allRecipeData[date] || { items: [] };
};