<template>
  <div>
    <v-file-input
      class="mb-0"
      accept="image/*,.doc,.docx,.xlsx,application/msword,application/pdf"
      color="primary accent-4"
      label="เอกสารประกอบการสอน"
      multiple
      dense
      placeholder="Select your files"
      prepend-icon="mdi-paperclip"
      outlined
      :show-size="1000"
      @change="viewFile"
    >
    </v-file-input>
    <v-row no-gutters v-if="files.length > 0">
      <v-col>
        <v-card class="mx-auto" max-width="400" tile elevation="3">
          <v-subheader
            >รายการไฟล์ที่เลือก ทั้งหมด {{ files.length }} ไฟล์</v-subheader
          >
          <v-list-item v-for="(file, index) in files" :key="index" two-line>
            <v-list-item-content>
              <v-list-item-title>{{ file.name }} </v-list-item-title>
              <v-list-item-subtitle>
                ขนาดไฟล์ {{ formatBytes(file.size) }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="red lighten-1" @click="removeFile(index)"
                  >mdi-close-thick</v-icon
                >
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import "@/mixins/generalMixin";

export default {
  name: "MultipleUploadInput",
  props: {
    fileList: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    files: [],
  }),

  watch: {
    fileList(val) {
      this.files = val;
    },
  },

  methods: {
    viewFile(event) {
      this.files = [...this.files, ...event];
      this.$emit("fileChange", this.files);
    },

    removeFile(index) {
      this.files.splice(index, 1);
      this.$emit("fileChange", this.files);
    },
  },
  created() {
    this.files = this.fileList;
    console.log("child", this.files);
  },
};
</script>
