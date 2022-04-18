<template>
  <v-container fluid class="mt-3">
    <h3>Dashboard</h3>
    <AdminDashboard />
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
import AdminDashboard from "./AdminDashboard.vue";

export default {
  name: "Dashboard",
  components: {
    AdminDashboard,
  },
  data() {
    return {};
  },
  methods: {},
  async created() {},
};
</script>
