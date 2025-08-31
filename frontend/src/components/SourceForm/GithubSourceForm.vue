<script setup>
import { ref, watch, defineEmits } from "vue";

const emit = defineEmits(["change"]);

const token = ref("");

watch([token], ([newToken]) => {
  emit("change", {
    token: newToken,
  });
});
</script>
<template>
  <v-text-field label="PAT Token" v-model="token"></v-text-field>
</template>
