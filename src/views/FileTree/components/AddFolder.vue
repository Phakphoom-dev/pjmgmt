<template>
  <v-container>
    <v-dialog v-model="addDialog" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5 mt-2">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- folderForm -->
            <validation-observer ref="observer">
              <v-form @submit.prevent="submit">
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="ชื่อเอกสาร"
                      rules="required"
                    >
                      <v-text-field
                        type="text"
                        prepend-icon="mdi-file"
                        dense
                        maxlength="100"
                        :error-messages="errors"
                        required
                        label="ชื่อเอกสาร"
                        v-model="folder.fsName"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="รายละเอียดเอกสาร"
                      rules="required"
                    >
                      <v-text-field
                        type="text"
                        prepend-icon="mdi-file-document-edit"
                        dense
                        maxlength="100"
                        :error-messages="errors"
                        required
                        label="รายละเอียดเอกสาร"
                        v-model="folder.fsDetail"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-form>
            </validation-observer>
            <!-- /folderForm -->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="$emit('close')">
            ยกเลิก
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="submit(folder)"
            :disabled="isLoading"
          >
            ยืนยัน
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
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
import { required, email } from "vee-validate/dist/rules";
import Loading from "@/components/Loading.vue";
import fileAPI from "@/api/file";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "กรุณากรอก {_field_}",
});

extend("email", {
  ...email,
  message: "กรุณากรอกอีเมลให้ถูกต้อง",
});

export default {
  name: "AddFolder",
  props: {
    resetValid: {
      default: false,
      type: Boolean,
    },
    action: {
      type: String,
    },
    addDialog: {
      type: Boolean,
    },
    folder: {
      type: Object,
    },
  },
  components: {
    Loading,
    ValidationObserver,
    ValidationProvider,
  },
  computed: {
    title() {
      return this.action === "add"
        ? "เพิ่มข้อมูลโครงสร้างเอกสาร"
        : "แก้ไขข้อมูลโครงสร้างเอกสาร";
    },
  },
  watch: {
    resetValid(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.observer.reset();
        });
      }
    },
  },
  data() {
    return {
      url: null,
      isLoading: false,
      teachers: [],
    };
  },
  methods: {
    previewImage() {
      if (this.folder.oldImg) {
        this.folder.oldImg = "";
      }

      if (this.folder.profileImg !== null) {
        this.url = URL.createObjectURL(this.folder.profileImg);
      }
    },
    async submit() {
      const isValid = await this.$refs.observer.validate();

      if (isValid) {
        this.isLoading = true;

        let formData = new FormData();

        for (const key in this.folder) {
          formData.append(key, this.folder[key]);
        }

        if (this.action === "add") {
          console.log(this.folder);
          fileAPI
            .addFolder(formData)
            .then((res) => {
              this.isLoading = false;
              this.$toast.open({
                type: "success",
                message: res.data.message,
              });
              this.$emit("close");
              this.$emit("getFolders");
            })
            .catch((err) => {
              this.isLoading = false;
              this.$toast.open({
                type: "error",
                message: err.response.data.message,
              });
              this.$emit("close");
            });
          console.log("add");
        }

        if (this.action === "edit") {
          fileAPI
            .editFolder(formData)
            .then((res) => {
              this.isLoading = false;
              this.$toast.open({
                type: "success",
                message: res.data.message,
              });
              this.$emit("close");
              this.$emit("getFolders");
            })
            .catch((err) => {
              this.isLoading = false;
              this.$toast.open({
                type: "error",
                message: err.response.data.message,
              });
              this.$emit("close");
            });
          console.log("edit");
        }
      } else {
        return;
      }
    },
  },
};
</script>
