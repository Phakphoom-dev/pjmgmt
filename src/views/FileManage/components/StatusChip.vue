<template>
  <v-container>
    <v-chip class="ma-2" color="warning" outlined v-if="status === 1">
      <v-icon left> mdi-warning </v-icon>
      อยู่ในระหว่างการจัดทำ
    </v-chip>
    <v-chip class="ma-2" color="success" outlined v-if="status === 2">
      <v-icon left> mdi-check </v-icon>
      ผ่านการตรวจสอบ
    </v-chip>
  </v-container>
</template>

<script>
export default {
  name: "StatusChip",
  props: {
    status: Number,
  },
};
</script>
