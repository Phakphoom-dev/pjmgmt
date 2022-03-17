<template>
  <div>
    <validation-observer ref="observer">
      <v-form @submit.prevent="submit">
        <validation-provider
          v-slot="{ errors }"
          name="ชื่อเว็บไซด์"
          rules="required"
        >
          <v-text-field
            type="text"
            prepend-icon="mdi-format-title"
            dense
            outlined
            maxlength="100"
            v-model="title"
            :error-messages="errors"
            label="ชื่อเว็บไซด์"
            required
          >
          </v-text-field>
        </validation-provider>

        <h3>ตั้งค่า Footer</h3>
        <validation-provider
          v-slot="{ errors }"
          name="Address"
          rules="required"
        >
          <v-text-field
            type="text"
            prepend-icon="mdi-map-marker"
            dense
            outlined
            maxlength="100"
            v-model="footerForm.address"
            :error-messages="errors"
            label="Address"
            required
          >
          </v-text-field>
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="Email"
          rules="required|email"
        >
          <v-text-field
            type="text"
            prepend-icon="mdi-email"
            dense
            outlined
            maxlength="100"
            v-model="footerForm.email"
            :error-messages="errors"
            label="Email"
            required
          >
          </v-text-field>
        </validation-provider>

        <validation-provider v-slot="{ errors }" name="Phone" rules="required">
          <v-text-field
            type="text"
            prepend-icon="mdi-phone"
            dense
            outlined
            maxlength="100"
            v-model="footerForm.phone"
            :error-messages="errors"
            label="Phone"
            required
          >
          </v-text-field>
        </validation-provider>

        <validation-provider
          v-slot="{ errors }"
          name="Facebook"
          rules="required"
        >
          <v-text-field
            type="text"
            prepend-icon="mdi-facebook"
            dense
            outlined
            maxlength="100"
            v-model="footerForm.facebook"
            :error-messages="errors"
            label="Facebook"
            required
          >
          </v-text-field>
        </validation-provider>

        <v-col cols="12">
          <v-btn
            class="mr-4"
            type="submit"
            block
            color="primary"
            :disabled="isLoading"
            :loading="isLoading"
          >
            ยืนยัน
          </v-btn>
        </v-col>
      </v-form>
    </validation-observer>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "HeadingTextForm",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      isLoading: false,
      title: "",
      footerForm: {
        address: "",
        email: "",
        phone: "",
        facebook: "",
      },
    };
  },
  methods: {
    async submit() {
      const isValid = await this.$refs.observer.validate();

      if (isValid) {
        this.isLoading = true;
        let formData = new FormData();
        formData.append("title", this.title);
        formData.append("address", this.footerForm.address);
        formData.append("email", this.footerForm.email);
        formData.append("phone", this.footerForm.phone);
        formData.append("facebook", this.footerForm.facebook);

        this.$http
          .post(
            `${process.env.VUE_APP_API_PATH}/manage/updateTitle.php`,
            formData
          )
          .then((res) => {
            if (res.status === 200) {
              this.$swal
                .fire({
                  icon: "success",
                  title: "แก้ไขข้อมูลสำเร็จ",
                  timer: 1500,
                  showConfirmButton: false,
                })
                .then((result) => {
                  this.isLoading = false;
                  window.location.reload();
                });
            }
          })
          .catch((err) => {
            this.isLoading = false;
            console.log(err);
          });
      }
    },
    getTitle() {
      this.isLoading = true;

      this.$http
        .get(`${process.env.VUE_APP_API_PATH}/manage/getTitle.php`)
        .then((res) => {
          this.title = res.data[0].title;
          this.footerForm = res.data[0];
          console.log(this.title);
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },
  created() {
    this.getTitle();
  },
};
</script>
