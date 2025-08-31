<script setup>
import { ref, watch, defineEmits } from "vue";

const emit = defineEmits(["change"]);

const url = ref("");
const username = ref("");
const token = ref("");

watch([url, username, token], ([newUrl, newUsername, newToken]) => {
  emit("change", {
    url: newUrl,
    username: newUsername,
    token: newToken,
  });
});
</script>
<template>
  <v-text-field label="URL" v-model="url"></v-text-field>
  <v-text-field label="Username" v-model="username"></v-text-field>
  <v-text-field label="HTTP Passowrd" v-model="token"></v-text-field>
</template>
