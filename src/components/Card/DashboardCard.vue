<template>
  <v-card class="mx-auto" outlined elevation="4">
    <v-list-item three-line>
      <v-list-item-content>
        <div>{{ title }}</div>
        <v-list-item-subtitle>{{ info }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-icon size="60px">{{ icon }}</v-icon>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  name: "Card",
  props: {
    title: String,
    info: String,
    icon: String,
  },
};
</script>

<style>
</style>