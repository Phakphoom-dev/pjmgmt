<template>
  <v-container fluid class="mt-3">
    <h3>Dashboard</h3>
    <v-row class="mt-3">
      <v-col xs="12" sm="6" lg="4">
        <DashboardCard
          title="ผู้เรียนทั้งหมด"
          :info="`${students.length} คน`"
          icon="mdi-account-arrow-right"
        ></DashboardCard>
      </v-col>
      <v-col xs="12" sm="6" lg="4">
        <DashboardCard
          title="ผู้เรียนที่กำลังศึกษา"
          :info="`${stdStudying} คน`"
          icon="mdi-account-clock"
        ></DashboardCard>
      </v-col>
      <v-col xs="12" sm="6" lg="4">
        <DashboardCard
          title="ผู้เรียนที่ผ่านการทดสอบ"
          :info="`${stdFinish} คน`"
          icon="mdi-book-open-blank-variant"
        ></DashboardCard>
      </v-col>
    </v-row>

    <v-row class="mt-3">
      <v-col>
        <v-card class="pa-3">
          <v-card-title
            >ข้อมูลผู้เรียนที่สมัครเรียนล่าสุด 10 อันดับแรก</v-card-title
          >
          <v-card-text>
            <v-simple-table class="elevation-2">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">ลำดับ</th>
                    <th class="text-left">ชื่อ-สกุล</th>
                    <th class="text-left">วัน-เวลาที่สมัคร</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(student, index) in students" :key="student.stdId">
                    <td>{{ index + 1 }}</td>
                    <td>{{ student.fullName }}</td>
                    <td>
                      {{ student.regisDate | moment("dddd, Do MMMM YYYY") }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>

          <v-card-title>ข้อมูลหลักสูตรที่สมัครเรียน</v-card-title>
          <v-card-text>
            <v-simple-table class="elevation-2">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">ลำดับ</th>
                    <th class="text-left">ชื่อหลักสูตร</th>
                    <th class="text-left">ชื่อผู้ลงทะเบียน</th>
                    <th class="text-left">เวลาที่ลงทะเบียน</th>
                    <th class="text-left">สถานะการเรียน</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(subject, index) in subjects" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ subject.subjectName }}</td>
                    <td>{{ subject.fullName }}</td>
                    <td>
                      {{ subject.regisDate | moment("dddd, Do MMMM YYYY") }}
                    </td>
                    <td>
                      <v-chip
                        v-if="subject.subjectProgress === 100"
                        color="primary"
                        >ผ่านการทดสอบ</v-chip
                      >
                      <v-chip v-else color="warning">กำลังศึกษา</v-chip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
import { users } from "./mockUser";
import { students } from "./mockSubject";
import DashboardCard from "@/components/Card/DashboardCard";

export default {
  name: "Dashboard",
  components: {
    DashboardCard,
  },
  data() {
    return {
      items: [
        {
          color: "#1F7087",
          src: "https://cdn.vuetifyjs.com/images/cards/foster.jpg",
          title: "Supermodel",
          artist: "Foster the People",
        },
        {
          color: "#952175",
          src: "https://cdn.vuetifyjs.com/images/cards/halcyon.png",
          title: "Halcyon Days",
          artist: "Ellie Goulding",
        },
      ],
      students: [],
      stdStudying: 0,
      stdFinish: 0,
      subjects: [],
      users,
    };
  },
  methods: {
    async getAllStudent() {
      this.students = await this.get(`/student/getAllStudent.php`);
      this.students.sort(function (a, b) {
        return (
          new Date(b.regisDate.replace(/\s/, "T") + "Z") -
          new Date(a.regisDate.replace(/\s/, "T") + "Z")
        );
      });
      console.log("students", this.students);
    },
    async getAllStudentSubject() {
      const datas = await this.get(`/student/getAllStudentSubject.php`);
      this.subjects = datas;

      datas.map((data) => {
        if (data.subjectProgress < 100) {
          this.stdStudying++;
        } else {
          this.stdFinish++;
        }
      });
    },
  },
  async created() {
    await this.getAllStudent();
    await this.getAllStudentSubject();
  },
};
</script>
