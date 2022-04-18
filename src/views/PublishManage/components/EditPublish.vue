<template>
  <v-container>
    <v-dialog v-model="show" persistent max-width="1000px">
      <v-card>
        <v-card-title>
          <span class="text-h5 mt-2">{{ title }} - {{ projectname }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-if="editData.length <= 0">
              <div class="title">นักศึกษายังไม่จัดทำเอกสาร</div>
            </v-row>
            <v-row v-for="folder in editData" :key="folder.sFolderId">
              <v-col cols="6">
                <div class="body-1">{{ folder.title }} :</div>
              </v-col>
              <v-col cols="6">
                <div class="body-1" v-if="folder.status === 0">
                  ยังไม่ได้รับการจัดทำ
                </div>
                <div class="body-1" v-if="folder.status === 1">
                  อยู่ในระหว่างการจัดทำ
                </div>
                <div class="body-1" v-if="folder.status === 2">
                  <v-switch
                    :label="folder.publish ? 'เผยแพร่' : 'ระงับการเผยแพร่'"
                    color="success"
                    v-model="folder.publish"
                    @change="changePublishSta(folder.publish, folder.sFolderId)"
                    hide-details
                  ></v-switch>
                </div>
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="$emit('close')">
            ยกเลิก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading -->
    <Loading :isLoading="isLoading" title="กำลังบันทึกข้อมูล..." />
    <!-- /Loading -->
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
import Loading from "@/components/Loading.vue";
import fileAPI from "@/api/file";

export default {
  name: "EditStudent",
  props: {
    projectname: {
      type: String,
    },
    title: {
      type: String,
    },
    show: {
      type: Boolean,
    },
    editData: {
      type: Array,
    },
  },

  components: {
    Loading,
  },

  data() {
    return {
      isLoading: false,
    };
  },

  computed: {},

  watch: {},

  methods: {
    changePublishSta(status, sFolderId) {
      let publishSta;
      status ? (publishSta = 1) : (publishSta = 0);
      let formData = new FormData();
      formData.append("publishSta", publishSta);
      formData.append("sFolderId", sFolderId);
      fileAPI.changePublishSta(formData);
    },
  },

  created() {},
};
</script>
