<template>
  <v-container>
    <v-dialog v-model="stdDialog" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5 mt-2">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- StudentForm -->
            <validation-observer ref="observer">
              <v-form @submit.prevent="submit" ref="form">
                <v-row>
                  <v-col cols="12" sm="4" md="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="คำนำหน้า"
                      rules="required"
                    >
                      <v-select
                        v-model="student.prefixId"
                        :items="prefix"
                        item-text="prefixName"
                        item-value="prefixId"
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
                        v-model="student.firstname"
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
                        v-model="student.lastname"
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
                        v-model="student.username"
                        v-debounce:300="checkUsername"
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
                        v-model="student.password"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" sm="12" md="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="รหัสนักศึกษา"
                      rules="required|length:10"
                    >
                      <v-text-field
                        type="text"
                        prepend-icon="mdi-account-lock"
                        dense
                        maxlength="10"
                        :error-messages="errors"
                        required
                        label="รหัสนักศึกษา"
                        v-model="student.code"
                        v-debounce:300="getFaculty"
                        ref="stdId"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>

                  <v-col cols="12">
                    <!-- Display Add Image -->
                    <v-col
                      cols="12"
                      v-if="student.profileImg && action == 'add'"
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
                    <v-col cols="12" v-if="action === 'edit' && student.oldImg">
                      <v-img
                        contain
                        class="mx-auto"
                        :aspect-ratio="16 / 9"
                        :src="imgPath('users', student.oldImg)"
                        max-height="300"
                        max-width="500"
                      ></v-img>
                    </v-col>

                    <v-col
                      cols="12"
                      v-if="action === 'edit' && !student.oldImg"
                    >
                      <v-img
                        contain
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
                      name="รูปนักศึกษา"
                      rules="required"
                    >
                      <v-file-input
                        class="mt-2"
                        @change="previewImage"
                        v-model="student.profileImg"
                        accept="image/*"
                        label="รูปนักศึกษา"
                        :error-messages="errors"
                        truncate-length="50"
                        prepend-icon="mdi-image"
                        dense
                      ></v-file-input>
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" sm="12" md="12" class="mb-0">
                    <validation-provider
                      v-slot="{ errors }"
                      name="ชื่อโครงงาน"
                      rules="required"
                    >
                      <v-text-field
                        type="text"
                        prepend-icon="mdi-file"
                        dense
                        :error-messages="errors"
                        required
                        label="ชื่อโครงงาน"
                        v-model="student.projectname"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>

                  <v-col cols="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="อาจารย์ที่ปรึกษา"
                      rules="required"
                    >
                      <v-autocomplete
                        prepend-icon="mdi-school"
                        v-model="student.teacherId"
                        :items="teachers"
                        label="อาจารย์ที่ปรึกษา"
                        item-text="fullName"
                        item-value="teacherId"
                        :error-messages="errors"
                      ></v-autocomplete>
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
                        v-model="student.tel"
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
                        v-model="student.email"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>

                  <v-col cols="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="ประเภทโครงงาน"
                      rules="required"
                    >
                      <v-select
                        prepend-icon="mdi-file-document-multiple-outline"
                        v-model="student.pTypeId"
                        :items="projectType"
                        item-text="pTypeName"
                        item-value="pTypeId"
                        label="ประเภทโครงงาน"
                        :error-messages="errors"
                      ></v-select>
                    </validation-provider>
                  </v-col>

                  <!-- 
                  <v-col cols="12" sm="12" md="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="คณะ"
                      rules="required"
                    >
                      <v-select
                        prepend-icon="mdi-domain"
                        v-model="student.facultyId"
                        :items="faculty"
                        item-text="facultyName"
                        item-value="facultyId"
                        label="คณะ"
                        :error-messages="errors"
                        @change="getBranch"
                      ></v-select>
                    </validation-provider>
                  </v-col> -->

                  <v-col cols="12" sm="12" md="6" class="mt-3">
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-domain"
                      dense
                      maxlength="100"
                      label="คณะ"
                      v-model="student.facultyName"
                      readonly
                      ref="facultyName"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="12" md="6" class="mt-3">
                    <v-text-field
                      type="text"
                      prepend-icon="mdi-school"
                      dense
                      maxlength="100"
                      required
                      label="สาขา"
                      v-model="student.branch"
                      ref="branch"
                      readonly
                    ></v-text-field>
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
import "@/mixins/generalMixin";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
import { required, email, length } from "vee-validate/dist/rules";
import Loading from "@/components/Loading.vue";
import userAPI from "@/api/user";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "กรุณากรอก {_field_}",
});

extend("length", {
  ...length,
  message: "ความยาว {_field_} ต้องมี 10 ตัวอักษร",
});

extend("email", {
  ...email,
  message: "กรุณากรอกอีเมลให้ถูกต้อง",
});

export default {
  name: "EditStudent",
  props: {
    faculty: {
      type: Array,
    },
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
    stdDialog: {
      type: Boolean,
    },
    student: {
      type: Object,
    },
    projectType: {
      type: Array,
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
        ? "เพิ่มข้อมูลนักศึกษา"
        : "แก้ไขข้อมูลนักศึกษา";
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

    facultyId(val) {
      console.log(val);
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
    getFaculty(val) {
      let facultyCode = val.substr(2, 2);
      let branchCode = val.substr(4, 3);

      switch (facultyCode) {
        case "03":
          this.student.facultyId = facultyCode;
          this.student.facultyName = "คณะนวัตกรรมเทคโนโลยีและการสร้างสรรค์";
          this.student.branch = "เทคโนโลยีดิจิทัล";
          break;
        default:
          this.student.facultyId = null;
          this.student.facultyName = "";
          this.student.branch = "";
          break;
      }

      this.$forceUpdate();

      console.log(this.student.branch);
    },

    // getBranch(facultyId) {
    //   console.log(facultyId);
    //   switch (facultyId) {
    //     case "013":
    //       this.student.branch = "เทคโนโลยีดิจิทัล";
    //       break;
    //     default:
    //       this.student.branch = "";
    //       break;
    //   }
    //   this.$forceUpdate();
    // },

    getTeachers() {
      userAPI
        .getTeachers({ role_id: 3 })
        .then((res) => {
          this.teachers = res.data.teacher;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    previewImage() {
      if (this.student.oldImg) {
        this.student.oldImg = "";
      }

      if (this.student.profileImg !== null) {
        this.url = URL.createObjectURL(this.student.profileImg);
      }
    },
    async submit() {
      const isValid = await this.$refs.observer.validate();

      if (!isValid) {
        this.$vuetify.goTo(0);
      }

      if (isValid) {
        if (this.student.facultyName === "" || this.student.branch === "") {
          this.$swal.fire("กรุณากรอกรหัสนักศึกษาให้ถูกต้อง");
          return;
        }

        this.isLoading = true;

        let formData = new FormData();

        for (const key in this.student) {
          formData.append(key, this.student[key]);
        }

        if (this.action === "add") {
          userAPI
            .addStudent(formData)
            .then((res) => {
              this.isLoading = false;
              this.$toast.open({
                type: "success",
                message: res.data.message,
              });
              this.$emit("close");
              this.$emit("getUsers");
            })
            .catch((err) => {
              this.isLoading = false;
              this.$toast.open({
                type: "error",
                message: err.response.data.message,
              });
              this.$emit("close");
            });
        }

        if (this.action === "edit") {
          userAPI
            .editStudent(formData)
            .then((res) => {
              this.isLoading = false;
              this.$toast.open({
                type: "success",
                message: res.data.message,
              });
              this.$emit("close");
              this.$emit("getUsers");
            })
            .catch((err) => {
              this.isLoading = false;
              this.$toast.open({
                type: "error",
                message: err.response.data.message,
              });
              this.$emit("close");
            });
        }
      }
    },
  },
  created() {
    console.log("render");
    this.getTeachers();
  },
};
</script>
