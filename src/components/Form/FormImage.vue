<template>
  <v-img :src="src" max-height="300" max-width="300"></v-img>
</template>

<script>
export default {
  name: "FormImage",
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
