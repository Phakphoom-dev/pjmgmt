<template>
  <v-container fluid class="mt-3">
    <h3>หลักสูตรที่ลงทะเบียน</h3>
    <v-row class="mt-3">
      <v-col>
        <v-btn color="info" @click="$router.push('showstudents')" class="mr-2"
          ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
        >
        <v-data-table
          :headers="subjectHeaders"
          :items="subjectsChange"
          sort-by="regisDate"
          class="elevation-1 mt-3"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>{{ $route.query.stdName }}</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="ค้นหาหลักสูตร"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                dark
                class="mb-2"
                @click="
                  $router.push({
                    name: 'RegisterSubject',
                    query: { stdId: $route.query.stdId },
                  })
                "
              >
                ลงทะเบียนหลักสูตร
              </v-btn>
            </v-toolbar>
          </template>

          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.regisDate="{ item }">
            {{ item.regisDate | moment("dddd, Do MMMM YYYY") }}
          </template>

          <template v-slot:item.active="{ item, index }">
            <div>
              <v-switch
                v-model="item.active"
                color="success"
                dense
                @change="
                  changeStatus(item.active, item.stdId, item.subjectId, index)
                "
              ></v-switch>
            </div>
          </template>

          <!-- <template v-slot:item.subjectRegister="{ item }">
            <div>
              <v-icon
                color="info"
                @click="
                  $router.push({
                    name: 'RegisterSubject',
                    params: { stdId: item.stdId },
                  })
                "
              >
                mdi-text-box-plus</v-icon
              >
            </div>
          </template> -->

          <template v-slot:item.edit="{ item }">
            <v-icon color="info" @click="editStdSubject(item)">
              mdi-pencil
            </v-icon>
          </template>

          <template v-slot:item.finishDate="{ item }">
            <v-chip :class="[isFinishColor(item)]">
              {{ isFinish(item) }}
            </v-chip>
          </template>

          <template v-slot:no-data> ไม่พบประวัติการลงทะเบียน </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "StudentSubject",
  data: () => ({
    subjects: [],
    stdId: null,
    search: "",
    subjectHeaders: [
      { text: "ลำดับที่", value: "index", sortable: false },
      { text: "วันที่ลงทะเบียน", value: "regisDate" },
      { text: "หลักสูตรที่ลงทะเบียน", value: "subjectName" },
      { text: "การใช้งาน", value: "active" },
      { text: "สถานะ", value: "finishDate" },
      { text: "จุดประสงค์การเรียน", value: "objective" },
      { text: "แก้ไข", value: "edit" },
    ],
    finishColor: "",
  }),
  computed: {
    subjectsChange() {
      return this.subjects;
    },
  },
  methods: {
    editStdSubject(item) {
      this.$router.push({
        name: "EditStudentSubject",
        query: {
          stdId: item.stdId,
          subjectId: item.subjectId,
          startDate: item.startDate,
          endDate: item.endDate,
          objective: item.objective,
        },
      });
      console.log(item);
    },

    changeStatus(status, stdId, subjectId, index) {
      let stdStatus = null;
      status ? (stdStatus = 1) : (stdStatus = 0);

      let formData = new FormData();
      formData.append("active", stdStatus);
      formData.append("stdId", stdId);
      formData.append("subjectId", subjectId);

      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/student/stdSubjectChange.php`,
          formData
        )
        .then((res) => {
          if (res.status === 200) {
            this.getAllStdSubject();
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.$toast.open({
            message: err.response.data.message,
            type: "warning",
            position: "top-right",
          });
          this.getAllStdSubject();
        });
    },

    isFinishColor(item) {
      if (item.isExpire === 1) {
        return "error";
      }

      if (item.active === 0) {
        return "warning";
      }

      if (item.finishDate !== null) {
        return "primary";
      } else {
        return "info";
      }
    },

    isFinish(item) {
      if (item.isExpire === 1) {
        return "หมดอายุ";
      }

      if (item.active === 0) {
        return "ปิดการใช้งาน";
      }

      if (item.finishDate !== null) {
        return "ผ่านการทดสอบ";
      } else {
        return "กำลังศึกษา";
      }
    },

    getAllStdSubject() {
      const jsonData = JSON.stringify({ stdId: this.stdId });
      this.$http
        .post(
          `${process.env.VUE_APP_API_PATH}/student/getAllStdSubject.php`,
          jsonData
        )
        .then((res) => {
          this.dialog = true;
          if (res.data.message === "ไม่พบข้อมูล") {
            this.subjects = [];
          } else {
            this.subjects = res.data;
          }
          console.log("subjects", this.subjects);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },
  created() {
    this.stdId = this.$route.query.stdId;
    this.getAllStdSubject();
  },
};
</script>
