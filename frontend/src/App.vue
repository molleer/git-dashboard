<script setup></script>

<template>
  <v-card class="nav-bar">
    <nav>
      <v-btn class="nav-button"
        ><router-link class="nav-link" to="/">Home</router-link></v-btn
      >
      <v-btn class="nav-button"
        ><router-link class="nav-link" to="/config">Config</router-link></v-btn
      >
    </nav>
  </v-card>
  <main>
    <router-view />
  </main>
</template>

<style>
.nav-bar {
  padding: 0.5rem;
}
.nav-button {
  margin-left: 1rem;
}
.nav-link {
  text-decoration: none;
  color: black;
}
</style>
