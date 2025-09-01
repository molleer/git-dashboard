<script setup>
import { defineProps } from "vue";

const props = defineProps(["changes"]);
const headers = [
  { title: "Title", value: "title" },
  { title: "Owner", value: "owner.name" },
  { title: "Repo", value: "repository" },
  { title: "Branch", value: "branch" },
  { title: "Source", value: "source" },
];
</script>

<template>
  <v-data-table :headers="headers" :items="props.changes">
    <template v-slot:[`item.title`]="{ value, item }">
      <a :href="item.url">{{ value }}</a>
    </template>
  </v-data-table>
</template>

<style></style>
