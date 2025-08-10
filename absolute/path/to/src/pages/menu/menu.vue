// ... existing code ...
// 添加菜品到订单
const addToOrder = (dish: any) => {
  // 先从本地存储获取最新的订单数据
  const storedOrder = uni.getStorageSync('orderData');
  let currentOrderData = storedOrder ? JSON.parse(storedOrder) : { items: [] };

  const newItem = {
    id: Date.now(),
    dishId: dish.id,
    name: dish.name,
    price: dish.price,
    quantity: 1
  };

  currentOrderData.items.push(newItem);
  saveOrderData(currentOrderData);

  uni.showToast({
    title: '已添加到订单',
    icon: 'success'
  });
};
// ... existing code ...