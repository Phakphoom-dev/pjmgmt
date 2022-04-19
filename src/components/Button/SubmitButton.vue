<template>
  <v-btn
    type="submit"
    class="text-capitalize"
    large
    :disabled="isDisabled"
    color="primary"
    @click="$emit('submit')"
    block
  >
    <v-progress-circular
      v-if="isLoading"
      indeterminate
      color="white"
      :width="5"
    ></v-progress-circular>
    <span v-else>ยืนยัน</span>
  </v-btn>
</template>

<script>
export default {
  name: "SubmitButton",
  props: {
    isLoading: {
      type: Boolean,
    },
    isDisabled: {
      default: false,
      type: Boolean,
    },
  },

  methods: {},
};
</script>
