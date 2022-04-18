<template>
  <v-container fluid>
    <v-row v-if="files.length > 0" cols="12" class="ma-0 ml-5 mt-3">
      <span class="mt-3">{{ title }} :</span>
      <v-col>
        <v-chip
          v-for="file in files"
          :key="file.sFileId"
          @click="preview(file.fileName)"
          @click:close="$emit('deleteFile', file)"
          class="ma-2"
          close
          :color="`${color} darken-1`"
          label
          text-color="white"
        >
          <v-icon left> mdi-pdf-box </v-icon>
          <strong> {{ file.fileName }} </strong>&nbsp;
        </v-chip>
      </v-col>
    </v-row>

    <v-row v-else class="ma-0 mt-3 ml-3">
      <h3>ยังไม่มีไฟล์เอกสาร</h3>
    </v-row>
  </v-container>
</template>

<script>
import fileAPI from "@/api/file";

export default {
  name: "FileTab",
  props: {
    color: {
      default: "teal",
      type: String,
    },
    title: {
      type: String,
    },
    showUpload: {
      type: Boolean,
    },
    files: {
      type: Array,
    },
  },

  data() {
    return {
      userData: JSON.parse(localStorage.getItem("userData")),
      file: null,
      isLoading: false,
    };
  },

  methods: {
    preview(filename) {
      fileAPI.openPDF(filename);
    },
  },
};
</script>
