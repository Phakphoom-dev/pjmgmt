<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5 mt-2">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- StudentForm -->
            <validation-observer ref="observer">
              <v-form @submit.prevent="submit">
                <v-row>
                  <v-col cols="12" class="mt-3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="ชื่อประเภทโครงงาน"
                      rules="required"
                    >
                      <v-text-field
                        type="text"
                        prepend-icon="mdi-file"
                        dense
                        maxlength="100"
                        :error-messages="errors"
                        required
                        label="ชื่อประเภทโครงงาน"
                        v-model="projectType.pTypeName"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-form>
            </validation-observer>
            <!-- /StudentForm -->
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
            @click="submit(student)"
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
import pTypeAPI from "@/api/pType";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
import { required, email } from "vee-validate/dist/rules";
import Loading from "@/components/Loading.vue";
import userAPI from "@/api/user";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "กรุณากรอก {_field_}",
});

export default {
  name: "EditProjectType",
  props: {
    resetValid: {
      default: false,
      type: Boolean,
    },
    action: {
      type: String,
    },
    dialog: {
      type: Boolean,
    },
    projectType: {
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
        ? "เพิ่มประเภทโครงงาน"
        : "แก้ไขประเภทโครงงาน";
    },
  },
  methods: {
    async submit() {
      const isValid = await this.$refs.observer.validate();

      if (isValid) {
        this.isLoading = true;

        let formData = new FormData();

        for (const key in this.projectType) {
          formData.append(key, this.projectType[key]);
        }

        if (this.action === "add") {
          pTypeAPI
            .addProjectType(formData)
            .then((res) => {
              this.isLoading = false;
              this.$toast.open({
                type: "success",
                message: res.data.message,
              });
              this.$emit("close");
              this.$emit("getType");
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
          pTypeAPI
            .editProjectType(formData)
            .then((res) => {
              this.isLoading = false;
              this.$toast.open({
                type: "success",
                message: res.data.message,
              });
              this.$emit("close");
              this.$emit("getType");
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
