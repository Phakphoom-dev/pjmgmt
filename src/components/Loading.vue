<template>
  <v-dialog v-model="isLoading" hide-overlay persistent width="500">
    <v-card color="primary" dark>
      <v-card-text>
        {{ title }}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Loading",
  props: {
    isLoading: {
      default: false,
      type: Boolean,
    },
    title: {
      type: String,
    },
  },
};
</script>
