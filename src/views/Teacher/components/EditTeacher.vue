<template>
  <v-container>
    <v-dialog v-model="teaDialog" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5 mt-2">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- teacherForm -->
            <validation-observer ref="observer">
              <v-form @submit.prevent="submit">
                <v-row>
                  <v-col cols="12" sm="4" md="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="คำนำหน้า"
                      rules="required"
                    >
                      <v-select
                        v-model="teacher.tPrefixId"
                        :items="prefix"
                        item-text="tPrefixName"
                        item-value="tPrefixId"
                        label="คำนำหน้า"
                        :error-messages="errors"
                      ></v-select>
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" sm="4" md="4" class="mt-3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="ชื่อ"
                      rules="required"
                    >
                      <v-text-field
                        type="text"
                        prepend-icon="mdi-account"
                        dense
                        maxlength="100"
                        :error-messages="errors"
                        required
                        label="ชื่อ"
                        v-model="teacher.firstname"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" sm="4" md="4" class="mt-3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="นามสกุล"
                      rules="required"
                    >
                      <v-text-field
                        type="text"
                        prepend-icon="mdi-account-box"
                        dense
                        maxlength="100"
                        :error-messages="errors"
                        required
                        label="นามสกุล"
                        v-model="teacher.lastname"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="ชื่อผู้ใช้งาน"
                      rules="required"
                    >
                      <v-text-field
                        type="text"
                        prepend-icon="mdi-card-account-details"
                        dense
                        maxlength="100"
                        :error-messages="errors"
                        required
                        label="ชื่อผู้ใช้งาน"
                        v-model="teacher.username"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="รหัสผ่าน"
                      rules="required"
                    >
                      <v-text-field
                        type="password"
                        prepend-icon="mdi-account-lock"
                        dense
                        maxlength="100"
                        :error-messages="errors"
                        required
                        label="รหัสผ่าน"
                        v-model="teacher.password"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>

                  <v-col cols="12">
                    <!-- Display Add Image -->
                    <v-col
                      cols="12"
                      v-if="teacher.profileImg && action == 'add'"
                    >
                      <v-img
                        class="mx-auto"
                        :aspect-ratio="16 / 9"
                        :src="url"
                        max-height="300"
                        max-width="500"
                      ></v-img>
                    </v-col>
                    <!-- /Display Add Image -->

                    <!-- Display Edit Image -->
                    <v-col cols="12" v-if="action === 'edit' && teacher.oldImg">
                      <v-img
                        class="mx-auto"
                        :aspect-ratio="16 / 9"
                        :src="imgPath('users', teacher.oldImg)"
                        max-height="300"
                        max-width="500"
                      ></v-img>
                    </v-col>

                    <v-col
                      cols="12"
                      v-if="action === 'edit' && !teacher.oldImg"
                    >
                      <v-img
                        class="mx-auto"
                        :aspect-ratio="16 / 9"
                        :src="url"
                        max-height="300"
                        max-width="500"
                      ></v-img>
                    </v-col>
                    <!-- /Display Edit Image -->

                    <validation-provider
                      v-slot="{ errors }"
                      name="รูปอาจารย์"
                      rules="required"
                    >
                      <v-file-input
                        class="mt-2"
                        @change="previewImage"
                        v-model="teacher.profileImg"
                        accept="image/*"
                        label="รูปอาจารย์"
                        :error-messages="errors"
                        truncate-length="50"
                        prepend-icon="mdi-image"
                        dense
                      ></v-file-input>
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="เบอร์โทรศัพท์"
                      rules="required"
                    >
                      <v-text-field
                        type="text"
                        prepend-icon="mdi-phone"
                        dense
                        maxlength="100"
                        :error-messages="errors"
                        required
                        label="เบอร์โทรศัพท์"
                        v-model="teacher.tel"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="อีเมล"
                      rules="required|email"
                    >
                      <v-text-field
                        type="text"
                        prepend-icon="mdi-email"
                        dense
                        maxlength="100"
                        :error-messages="errors"
                        required
                        label="อีเมล"
                        v-model="teacher.email"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-form>
            </validation-observer>
            <!-- /teacherForm -->
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
            @click="submit(teacher)"
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
import userAPI from "@/api/user";

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
  name: "EditTeacher",
  props: {
    prefix: {
      type: Array,
    },
    resetValid: {
      default: false,
      type: Boolean,
    },
    action: {
      type: String,
    },
    teaDialog: {
      type: Boolean,
    },
    teacher: {
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
        ? "เพิ่มข้อมูลอาจารย์"
        : "แก้ไขข้อมูลอาจารย์";
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
    };
  },
  methods: {
    previewImage() {
      if (this.teacher.oldImg) {
        this.teacher.oldImg = "";
      }

      if (this.teacher.profileImg !== null) {
        this.url = URL.createObjectURL(this.teacher.profileImg);
      }
    },
    async submit() {
      const isValid = await this.$refs.observer.validate();

      if (isValid) {
        this.isLoading = true;

        let formData = new FormData();

        for (const key in this.teacher) {
          formData.append(key, this.teacher[key]);
        }

        if (this.action === "add") {
          userAPI
            .addTeacher(formData)
            .then((res) => {
              this.isLoading = false;
              this.$toast.open({
                type: "success",
                message: res.data.message,
              });
              this.$emit("close");
              this.$emit("getTeachers");
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
          userAPI
            .editTeacher(formData)
            .then((res) => {
              this.isLoading = false;
              this.$toast.open({
                type: "success",
                message: res.data.message,
              });
              this.$emit("close");
              this.$emit("getTeachers");
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
  created() {},
};
</script>
