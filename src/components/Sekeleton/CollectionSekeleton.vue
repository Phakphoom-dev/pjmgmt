<template>
  <v-row v-if="isLoading">
    <v-col v-for="i in 3" :key="i" cols="12" md="12">
      <v-skeleton-loader
        v-bind="attrs"
        type="image, article"
      ></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "CollectionSekeleton",
  props: ["isLoading"],
  data() {
    return {
      attrs: {
        class: "mb-6",
        elevation: 2,
      },
    };
  },
};
</script>

