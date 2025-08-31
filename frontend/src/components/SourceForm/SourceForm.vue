<script setup>
import GerritSourceForm from "./GerritSourceForm.vue";
import GithubSourceForm from "./GithubSourceForm.vue";
import { ref, defineEmits } from "vue";

const emits = defineEmits(["submit"]);

const source_type = ref(["gerrit"]);
const source_config = ref({});
const name = ref("");

function on_change(data) {
  source_config.value = {
    ...data,
    type: source_type.value[0],
    name: name.value,
  };
}
</script>

<template>
  <v-select
    label="Source Type"
    :items="['gerrit', 'github']"
    v-model="source_type"
  ></v-select>
  <v-text-field label="Name" v-model="name"></v-text-field>
  <template v-if="source_type == 'gerrit'">
    <gerrit-source-form @change="data => on_change(data)"></gerrit-source-form>
  </template>
  <template v-if="source_type == 'github'">
    <github-source-form @change="data => on_change(data)"></github-source-form>
  </template>
  <v-btn @click="emits('submit', source_config)">Create</v-btn>
</template>
