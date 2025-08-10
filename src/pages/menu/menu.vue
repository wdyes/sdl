<template>
  <view class="container">
    <view class="header">
      <text class="title">菜品</text>
      <!-- 添加日期选择器 -->
      <view class="date-picker-container">
        <text>选择日期：</text>
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
    
    <view class="dish-list">
      <view class="dish-item" v-for="dish in dishes" :key="dish.id">
        <view class="dish-info">
          <view class="image-upload-container">
            <image class="dish-image" :src="dish.image || '/static/default-dish.jpg'" mode="aspectFit"></image>
            <button class="upload-btn" @click="uploadImage(dish.id)">上传/修改图片</button>
          </view>
          <text class="dish-name">{{ dish.name }}</text>
          <text class="dish-price">¥{{ dish.price }}</text>
        </view>
        <view class="dish-actions">
          <!-- 修改按钮文本 -->
          <button class="add-btn" @click="addToRecipe(dish)">添加到食谱</button>
          <button class="delete-btn" @click="deleteDish(dish.id)">删除</button>
        </view>
      </view>
    </view>
    
    <view class="add-dish">
      <input type="text" v-model="newDishName" placeholder="输入菜品名称" />
      <input type="number" v-model="newDishPrice" placeholder="输入菜品价格" />
      <view class="new-image-container">
        <button class="new-upload-btn" @click="uploadNewDishImage">上传菜品图片</button>
        <image v-if="newDishImage" class="preview-image" :src="newDishImage" mode="aspectFit"></image>
      </view>
      <button @click="addDish">添加菜品</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 修改导入语句
import { initMenuData, saveMenuData, initRecipeData, saveRecipeDataByDate } from '../../utils/dataStorage';

// 添加日期相关变量
const selectedDate = ref('');
const dishes = ref([]);
const newDishName = ref('');
const newDishPrice = ref('');
const newDishImage = ref('');

// 初始化日期为今天并加载数据
onMounted(() => {
  const menuData = initMenuData();
  dishes.value = menuData.dishes;
  // 设置默认日期为今天
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  selectedDate.value = `${year}-${month}-${day}`;
});

// 日期变化处理函数
const handleDateChange = (e: any) => {
  selectedDate.value = e.detail.value;
  console.log('选择的日期:', selectedDate.value);
};

// 从本地存储加载数据
// 移除这个重复的 onMounted 钩子
onMounted(() => {
  const menuData = initMenuData();
  dishes.value = menuData.dishes;
});

// 添加菜品到每日食谱
const addToRecipe = (dish: any) => {
  const allRecipeData = initRecipeData();
  let currentDateRecipeData = allRecipeData[selectedDate.value] || { items: [] };

  const existingItemIndex = currentDateRecipeData.items.findIndex(item => item.dishId === dish.id);

  if (existingItemIndex !== -1) {
    currentDateRecipeData.items[existingItemIndex].quantity += 1;
  } else {
    const newItem = {
      id: Date.now(),
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image || '/static/default-dish.jpg',
      quantity: 1
    };
    currentDateRecipeData.items.push(newItem);
  }

  // 使用 saveRecipeDataByDate 函数保存数据
  saveRecipeDataByDate(selectedDate.value, currentDateRecipeData);

  uni.showToast({
    title: '已添加到食谱',
    icon: 'success'
  });
};

// 删除菜品
const deleteDish = (id: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个菜品吗？',
    success: (res) => {
      if (res.confirm) {
        dishes.value = dishes.value.filter(dish => dish.id !== id);
        saveMenuData({ dishes: dishes.value });
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        });
      }
    }
  });
};

// 上传新菜品图片
const uploadNewDishImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      newDishImage.value = res.tempFilePaths[0];
    }
  });
};

// 上传/修改菜品图片
const uploadImage = (id: number) => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const dishIndex = dishes.value.findIndex(dish => dish.id === id);
      if (dishIndex !== -1) {
        // 这里只是模拟上传，实际项目中需要上传到服务器
        // 这里使用临时文件路径作为图片路径
        dishes.value[dishIndex].image = res.tempFilePaths[0];
        saveMenuData({ dishes: dishes.value });
        uni.showToast({
          title: '图片上传成功',
          icon: 'success'
        });
      }
    }
  });
};

// 添加新菜品
const addDish = () => {
  if (!newDishName.value || !newDishPrice.value) {
    uni.showToast({
      title: '请输入菜品名称和价格',
      icon: 'none'
    });
    return;
  }

  const newDish = {
    id: Date.now(),
    name: newDishName.value,
    price: Number(newDishPrice.value),
    // 修改添加新菜品时的图片路径
    image: newDishImage.value || '/static/default-dish.jpg'
  };

  dishes.value.push(newDish);
  saveMenuData({ dishes: dishes.value });

  newDishName.value = '';
  newDishPrice.value = '';
  newDishImage.value = '';

  uni.showToast({
    title: '添加成功',
    icon: 'success'
  });
};
</script>

<style scoped>
.container {
  padding: 20rpx;
}

.header {
  text-align: center;
  margin-bottom: 30rpx;
  padding: 20rpx 0;
}

.date-picker-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15rpx;
  position: relative;
}

.native-date-picker {
  width: 300rpx;
  height: 70rpx;
  line-height: 70rpx;
  border: 1rpx solid #ccc;
  padding: 0 10rpx;
  background-color: #fff;
  z-index: 9999;
  position: relative;
}

.date-picker-container text {
  font-size: 28rpx;
  margin-right: 10rpx;
}

.picker {
  width: 100%;
  height: 100%;
  font-size: 28rpx;
}
.native-date-picker {
  width: 300rpx; /* 确保有足够宽度 */
  height: 70rpx;
  line-height: 70rpx;
  border: 1rpx solid #ccc; /* 添加边框使其更明显 */
  padding: 0 10rpx;
  background-color: #fff; /* 确保背景色可见 */
  z-index: 9999; /* 确保显示在最上层 */
}

.title {
  font-size: 40rpx;
  font-weight: bold;
}

.dish-list {
  margin-bottom: 30rpx;
}

.dish-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.dish-info {
  flex: 1;
}

.dish-name {
  font-size: 32rpx;
  margin-right: 20rpx;  /* 添加右边距与价格分隔 */
  /* 删除 display: block; */
}

.dish-price {
  font-size: 28rpx;
  color: #f00;
  display: inline-block;   /*  确保价格也作为行内块元素显示*/
}

.dish-actions {
  display: flex;
  gap: 10rpx;
}

.add-btn {
  background-color: #007aff;
  color: #fff;
  font-size: 24rpx;
  padding: 0 15rpx;
  height: 60rpx;
  line-height: 60rpx;
}

.delete-btn {
  background-color: #ff4d4f;
  color: #fff;
  font-size: 24rpx;
  padding: 0 15rpx;
  height: 60rpx;
  line-height: 60rpx;
}

.add-dish {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 20rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
}

.add-dish input {
  height: 80rpx;
  padding: 0 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
}

.add-dish button {
  background-color: #52c41a;
  color: #fff;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 32rpx;
}
.image-upload-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.dish-image {
  width: 80px;
  height: 80px;
  margin-right: 10px;
}

.upload-btn {
  flex: 1;
  height: 35px;
  line-height: 35px;
  font-size: 12px;
  padding: 0;
}
.new-image-container {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.new-upload-btn {
  flex: 1;
  height: 40px;
  margin-right: 10px;
}

.preview-image {
  width: 80px;
  height: 80px;
}
</style>