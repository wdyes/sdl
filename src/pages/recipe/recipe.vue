// 添加日期选择器到模板
<template>
  <view class="container">
    <view class="header">
      <text class="title">食谱详情</text>
      <!-- 添加日期选择器 -->
      <view class="date-picker-container">
        <text class="date-label">选择日期：</text>
        <picker 
          mode="date"
          :value="selectedDate"
          start="2020-01-01"
          end="2030-12-31"
          @change="handleDateChange"
          class="native-date-picker"
        >
          <view class="picker">
            {{selectedDate}}
          </view>
        </picker>
      </view>
    </view>
    <view class="recipe-list" v-if="recipeItems.length > 0">
      <view class="recipe-item" v-for="item in recipeItems" :key="item.id">
        <view class="item-info">
          <image class="item-image" :src="item.image || '/static/default-dish.jpg'" mode="aspectFit"></image>
          <text class="item-name">{{ item.name }}</text>
          <text class="item-price">¥{{ item.price }}</text>
        </view>
        <view class="quantity-control">
          <button class="quantity-btn minus" @click="decreaseQuantity(item.id)">-</button>
          <text class="quantity">{{ item.quantity }}</text>
          <button class="quantity-btn plus" @click="increaseQuantity(item.id)">+</button>
        </view>
        <button class="delete-btn" @click="deleteRecipeItem(item.id)">删除</button>
      </view>
      <button class="clear-btn" @click="clearRecipe">清空每日食谱</button>
    </view>
    
    <view class="empty-recipe" v-else>
      <text>每日食谱为空</text>
    </view>
  </view>
</template>

// 添加日期相关逻辑到script部分
<script setup lang="ts">
// 合并导入语句
import { ref, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { initRecipeData, saveRecipeData, initMenuData, saveRecipeDataByDate } from '../../utils/dataStorage';

// 添加日期相关变量
const selectedDate = ref('');
const recipeItems = ref([]);

// 初始化日期为今天
onMounted(() => {
  // 设置默认日期为今天
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  selectedDate.value = `${year}-${month}-${day}`;
  loadRecipeDataByDate(selectedDate.value);
});

// 页面显示时加载数据
onShow(() => {
  loadRecipeDataByDate(selectedDate.value);
});

// 根据日期加载食谱数据
const loadRecipeDataByDate = (date: string) => {
  const allRecipeData = initRecipeData();
  const menuData = initMenuData();
  
  // 获取指定日期的食谱数据
  const dateRecipeData = allRecipeData[date] || { items: [] };
  
  // 为食谱项添加图片信息
  dateRecipeData.items = dateRecipeData.items.map(item => {
    const dish = menuData.dishes.find(d => d.id === item.dishId);
    if (dish && dish.image) {
      return { ...item, image: dish.image };
    }
    return item;
  });
  
  recipeItems.value = dateRecipeData.items;
};

// 日期变化处理函数
const handleDateChange = (e: any) => {
  selectedDate.value = e.detail.value;
  loadRecipeDataByDate(selectedDate.value);
};

// 修改删除食谱项函数
const deleteRecipeItem = (id: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个食谱项吗？',
    success: (res) => {
      if (res.confirm) {
        recipeItems.value = recipeItems.value.filter(item => item.id !== id);
        saveRecipeDataByDate(selectedDate.value, { items: recipeItems.value });
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        });
      }
    }
  });
};

// 修改清空食谱函数
const clearRecipe = () => {
  uni.showModal({
    title: '确认清空',
    content: '确定要清空当前日期的所有食谱吗？',
    success: (res) => {
      if (res.confirm) {
        recipeItems.value = [];
        saveRecipeDataByDate(selectedDate.value, { items: [] });
        uni.showToast({
          title: '食谱已清空',
          icon: 'success'
        });
      }
    }
  });
};

// 修改增减数量函数
const increaseQuantity = (id: number) => {
  const itemIndex = recipeItems.value.findIndex(item => item.id === id);
  if (itemIndex !== -1) {
    recipeItems.value[itemIndex].quantity += 1;
    saveRecipeDataByDate(selectedDate.value, { items: recipeItems.value });
  }
};

const decreaseQuantity = (id: number) => {
  const itemIndex = recipeItems.value.findIndex(item => item.id === id);
  if (itemIndex !== -1) {
    if (recipeItems.value[itemIndex].quantity > 1) {
      recipeItems.value[itemIndex].quantity -= 1;
      saveRecipeDataByDate(selectedDate.value, { items: recipeItems.value });
    } else {
      deleteRecipeItem(id);
    }
  }
};

// 添加按日期保存食谱数据的函数 - 这会覆盖导入的函数
const saveRecipeDataByDate = (date: string, data: any) => {
  const allRecipeData = initRecipeData();
  allRecipeData[date] = data;
  uni.setStorageSync('recipeData', JSON.stringify(allRecipeData));
};
</script>

// 添加日期选择器样式
<style scoped>
.container {
  padding: 20rpx;
}

.header {
  text-align: center;
  margin-bottom: 30rpx;
  padding: 20rpx 0;
}

/* 添加日期选择器样式 */
.date-picker-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15rpx;
}

.date-picker-container text {
  font-size: 28rpx;
  margin-right: 10rpx;
}

.native-date-picker {
  width: 300rpx;
  height: 70rpx;
  line-height: 70rpx;
  border: 1rpx solid #ccc;
  padding: 0 10rpx;
  background-color: #fff;
  z-index: 9999;
  font-size: 28rpx;
}

.picker {
  width: 100%;
  height: 100%;
  font-size: 28rpx;
}
.title {
  font-size: 40rpx;
  font-weight: bold;
}

.recipe-list {
  margin-bottom: 30rpx;
}

.recipe-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 32rpx;
  margin-bottom: 10rpx;
  display: block;
}

.item-price {
  font-size: 28rpx;
  color: #f00;
}

.delete-btn {
  background-color: #ff4d4f;
  color: #fff;
  font-size: 24rpx;
  padding: 0 15rpx;
  height: 60rpx;
  line-height: 60rpx;
}

.clear-btn {
  margin-top: 20rpx;
  width: 100%;
  background-color: #ff4d4f;
  color: white;
}
.empty-recipe {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}
.quantity-control {
  display: flex;
  align-items: center;
  margin-right: 20rpx;
}

.quantity-btn {
  width: 60rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 32rpx;
  padding: 0;
}

.quantity-btn.minus {
  background-color: #f5f5f5;
  color: #333;
}

.quantity-btn.plus {
  background-color: #1989fa;
  color: #fff;
}

.quantity {
  width: 60rpx;
  text-align: center;
  font-size: 28rpx;
}
.item-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}
</style>