<script setup>
import axios from "axios";
import { ref } from "vue";

import SourceForm from "@/components/SourceForm/SourceForm.vue";

const dashGroupBy = [{ key: "dashboard" }];
const dashConfigHeaders = [
  {
    title: "Dashboard",
    key: "dashboard",
  },
  {
    title: "Source",
    key: "source",
  },
  {
    title: "Query",
    key: "query",
  },
  {
    title: "Repo",
    key: "repo",
  },
  {
    title: "State",
    key: "state",
  },
];
const sourceHeaders = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Type",
    key: "type",
  },
  {
    title: "URL",
    key: "url",
  },
  {
    title: "Username",
    key: "username",
  },
  {
    title: "Token",
    key: "token",
  },
  {
    title: "",
    key: "delete",
  },
];

const sources = ref([]);
const dashbaordConfigs = ref([]);

const addSourceDialog = ref(false);

function fetch_resources() {
  axios
    .get("/api/sources")
    .then(data => (sources.value = data.data))
    .catch(error => console.log(error));
}

function create_source(source_config) {
  axios
    .post("/api/sources/add", source_config)
    .then(() => {
      addSourceDialog.value = false;
      fetch_resources();
    })
    .catch(error => console.log(error));
}

function delete_source(name) {
  axios
    .post("/api/sources/delete", { name })
    .then(() => fetch_resources())
    .catch(error => console.log(error));
}

fetch_resources();
axios
  .get("/api/dashboard/configs")
  .then(data => (dashbaordConfigs.value = data.data))
  .catch(error => console.log(error));
</script>
<template>
  <v-card class="table">
    <div class="title-container">
      <v-card-title>Sources</v-card-title>
      <v-btn @click="addSourceDialog = true">Add+</v-btn>
    </div>
    <v-data-table
      :headers="sourceHeaders"
      :items="Object.keys(sources).map(key => ({ name: key, ...sources[key] }))"
    >
      <template v-slot:[`item.delete`]="{ item }">
        <v-btn @click="delete_source(item.name)">Delete</v-btn>
      </template>
    </v-data-table>
  </v-card>
  <v-card class="table">
    <div class="title-container">
      <v-card-title>Dashboards</v-card-title>
    </div>
    <v-data-table
      :group-by="dashGroupBy"
      :headers="dashConfigHeaders"
      :items="
        Object.keys(dashbaordConfigs)
          .map(dash =>
            dashbaordConfigs[dash].map(conf => ({ dashboard: dash, ...conf })),
          )
          .flat()
      "
    >
    </v-data-table>
  </v-card>
  <v-dialog v-model="addSourceDialog" max-width="500">
    <v-card class="dialog-card">
      <v-card-title>Add Source</v-card-title>
      <source-form @submit="create_source"></source-form>
    </v-card>
  </v-dialog>
</template>

<style>
.table {
  margin: 1rem;
}
.title-container {
  display: flex;
  justify-content: space-between;
  padding-right: 1rem;
  padding-top: 1rem;
}
.dialog-card {
  padding: 2rem;
}
</style>
