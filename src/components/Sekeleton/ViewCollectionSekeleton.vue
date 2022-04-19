<template>
  <v-row v-if="isLoading">
    <v-col cols="12" md="12">
      <v-skeleton-loader
        height="800"
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
