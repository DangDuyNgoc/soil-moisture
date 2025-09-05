<template>
  <ul>
    <li v-for="(req, index) in requests" :key="index">
      {{ req.title }} - {{ req.status }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from "vue";

const requests = ref([
  { title: "Yêu cầu nghỉ phép", status: "Chờ duyệt" },
  { title: "Đề xuất mua thiết bị", status: "Đã duyệt" },
]);
</script>
