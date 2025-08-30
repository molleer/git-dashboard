<script setup>
import DashBoard from "../components/DashBoard.vue";
import axios from "axios";
import { ref } from "vue";

const dashboards = ref([]);

axios.get("/api/dashboard").then(data => (dashboards.value = data.data));
</script>

<template>
  <template v-for="name of Object.keys(dashboards)" :key="name">
    <v-card class="dash-card">
      <v-card-title>{{ name }}</v-card-title>
      <dash-board :changes="dashboards[name]"></dash-board>
    </v-card>
  </template>
</template>

<style>
.dash-card {
  margin: 2rem;
}
</style>
