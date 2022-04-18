<template>
  <v-card class="mx-auto">
    <v-list subheader two-line>
      <v-subheader inset>ประวัติการจัดการไฟล์</v-subheader>
      <v-virtual-scroll
        height="400"
        item-height="64"
        :items="files"
        :bench="benched"
      >
        <template v-slot:default="{ item }">
          <v-list-item :key="item.fileLogId">
            <v-list-item-avatar>
              <v-icon :class="item.teacherId ? 'orange' : 'teal'" dark
                >mdi-clipboard-text</v-icon
              >
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.fileName"></v-list-item-title>

              <v-list-item-subtitle
                v-text="
                  `${$moment(item.fileLogTime).format(
                    'Do MMMM YYYY, hh:mm:ss'
                  )}`
                "
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              {{ item.teacherId ? "อาจารย์" : "นักศึกษา" }} /
              {{ item.fileAction === "ADD" ? "เพิ่มเอกสาร" : "ลบเอกสาร" }}
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "FileList",
  props: {
    files: {
      type: Array,
    },
  },
  data() {
    return {
      benched: 0,
    };
  },
  computed: {},
  methods: {},
  created() {},
};
</script>
