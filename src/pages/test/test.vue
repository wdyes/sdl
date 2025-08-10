<template>
  <view class="container">
    <text>测试日期选择器：</text>
    <uni-date-picker
      v-model="testDate"
      mode="date"
      @change="handleTestChange"
    ></uni-date-picker>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const testDate = ref('');
const handleTestChange = (e: any) => {
  console.log('选择的日期:', e.detail.value);
};
</script>

<style scoped>
.container { padding: 20rpx; }
.uni-date-picker { border: 1rpx solid #ccc; background-color: #fff; }
</style>