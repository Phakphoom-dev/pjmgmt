<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>รายงาน การเข้า-ออกระบบ</h3>
    </v-row>

    <v-btn color="info" @click="$router.go(-1)" class="mr-2"
      ><v-icon small class="mr-1">mdi-arrow-left</v-icon> ย้อนกลับ</v-btn
    >

    <!-- <v-row>
      <v-col>
        <v-btn color="secondary" to="studentLog">จัดการหลักสูตร</v-btn>
        <v-btn color="primary" class="ml-2" to="studentLog/subjects"
          >จัดการรายวิชา</v-btn
        >
        <v-btn color="secondary" class="ml-2">จัดการบทเรียน</v-btn>
      </v-col>
    </v-row> -->

    <v-row class="mt-3">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="studentLog"
          sort-by="username"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title
                >ข้อมูลการเข้าใช้งานระบบ - {{ fullName }}</v-toolbar-title
              >
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.courseName"
                            label="ชื่อหลักสูตร"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-switch
                            v-model="editedItem.active"
                            color="success"
                            :error="!editedItem.active"
                            label="การใช้งาน"
                          ></v-switch>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      ยกเลิก
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      ยืนยัน
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >ต้องการลบผู้สอนหรือไม่ ?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >ยกเลิก</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >ยืนยัน</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.loginTime="{ item }">
            {{
              item.logType === "login"
                ? toThaiDateString(
                    new Date(item.logTime.replace(/\s/, "T") + "Z")
                  )
                : "-"
            }}
          </template>

          <template v-slot:item.logoutTime="{ item }">
            {{
              item.logType === "logout"
                ? toThaiDateString(
                    new Date(item.logTime.replace(/\s/, "T") + "Z")
                  )
                : "-"
            }}
          </template>

          <!-- <template v-slot:item.logType="{ item }">
            <v-chip :color="item.logType === 'login' ? 'primary' : 'warning'">
              {{
                item.logType === "login" ? "เข้าสู่ระบบ" : "ออกจากระบบ"
              }}</v-chip
            >
          </template> -->
          <!-- 
          <template slot="body.append">
            <tr class="primary--text">
              <th><h6>รวม</h6></th>
              <th></th>
              <th></th>
              <th></th>
              <th><h6>2 ชม.</h6></th>
            </tr>
          </template> -->
          <template v-slot:no-data> ยังไม่มีบันทึกการเข้าระบบ </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";

export default {
  name: "StudentLog",
  data: () => ({
    fullName: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ลำดับที่", value: "index" },
      { text: "วัน-เวลาที่เข้าระบบ", value: "loginTime" },
      { text: "วัน-เวลาที่ออกระบบ", value: "logoutTime" },
      { text: "จาก IP", value: "ipAddress" },
    ],
    studentLog: [],
    editedIndex: -1,
    editedItem: {
      subjectName: "",
      active: true,
    },
    defaultItem: {
      subjectName: "",
      active: true,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มหลักสูตร" : "แก้ไขหลักสูตร";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    visitReport() {
      this.$router.push("visitreport");
    },
    stdStaColor(status) {
      let color = "";
      switch (status) {
        case "กำลังศึกษา":
          color = "primary";
          break;
        case "รอการยืนยัน":
          color = "warning";
          break;
        case "สำเร็จการศึกษา":
          color = "success";
          break;
        case "ยกเลิก":
          color = "error";
          break;
        default:
          color = "grey";
          break;
      }
      return color;
    },
    editItem(item) {
      console.log(item);
      this.$router.push({
        name: "ExamQuizs",
        params: {
          quiz: item,
        },
      });
      // this.editedIndex = this.studentLog.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      // this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.studentLog.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.studentLog.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.studentLog[this.editedIndex], this.editedItem);
      } else {
        this.studentLog.push(this.editedItem);
      }
      this.close();
    },

    getStdLog() {
      let formData = new FormData();
      formData.append("stdId", this.$route.query.stdId);

      this.$http
        .post(`${process.env.VUE_APP_API_PATH}/student/getStdLog.php`, formData)
        .then((res) => {
          if (res.status === 200) {
            this.studentLog = res.data;
            this.fullName = res.data[0].fullName;
            console.log("studentLog", this.studentLog);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  created() {
    console.log(this.$route.query.stdId);
    this.getStdLog();
  },
};
</script>
