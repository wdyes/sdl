<script setup lang="ts">
// 临时添加，运行一次后删除
// uni.clearStorageSync();
// console.log('本地存储已清空');

import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("App Launch");
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});
</script>
<style></style>
