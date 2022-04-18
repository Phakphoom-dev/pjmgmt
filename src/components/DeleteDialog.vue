<template>
  <v-row justify="center">
    <v-dialog v-model="showDelete" persistent max-width="500">
      <v-card>
        <v-card-title class="text-h5"> ลบข้อมูล </v-card-title>
        <v-card-text>ต้องการลบข้อมูลหรือไม่ ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="$emit('closeDelete')">
            ยกเลิก
          </v-btn>
          <v-btn color="blue darken-1" text @click="$emit('confirmDelete')">
            ยืนยัน
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "DeleteDialog",
  props: {
    showDelete: {
      type: Boolean,
    },
  },
};
</script>
