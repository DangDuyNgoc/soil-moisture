<template>
  <form @submit.prevent="addRequest">
    <input v-model="newRequest" placeholder="Nhập yêu cầu..." />
    <button type="submit">Thêm</button>
  </form>
</template>

<script setup>
import { ref } from "vue";

const newRequest = ref("");

const addRequest = () => {
  if (newRequest.value.trim()) {
    alert("Thêm yêu cầu: " + newRequest.value);
    newRequest.value = "";
  }
};
</script>
