<script setup>
import axios from "axios";
import { ref } from "vue";

const dashGroupBy = [{ key: "dashboard" }];
const dashConfigHeaders = [
  {
    title: "Dashboard",
    key: "dashboard",
    groupable: false,
  },
  {
    title: "Source",
    key: "source",
  },
  {
    title: "Query",
    key: "query",
  },
];

const sources = ref([]);
const dashbaordConfigs = ref([]);

axios
  .get("/api/sources")
  .then(data => (sources.value = data.data))
  .catch(error => console.log(error));
axios
  .get("/api/dashboard/configs")
  .then(data => (dashbaordConfigs.value = data.data))
  .catch(error => console.log(error));
</script>
<template>
  <v-card class="table">
    <v-card-title>Sources</v-card-title>
    <v-data-table
      :items="Object.keys(sources).map(key => ({ name: key, ...sources[key] }))"
    ></v-data-table>
  </v-card>
  <v-card class="table">
    <v-card-title>Dashboards</v-card-title>
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
</template>

<style>
.table {
  margin: 1rem;
}
</style>
