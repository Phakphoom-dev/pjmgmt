<template>
  <v-container fluid class="mt-3">
    <h3>Dashboard</h3>
    <v-row class="mt-3">
      <v-col xs="12" sm="6" lg="3">
        <dashboard-card
          title="นักเรียนที่สมัครวันนี้"
          info="10 คน"
          icon="mdi-account-arrow-right"
        ></dashboard-card>
      </v-col>
      <v-col xs="12" sm="6" lg="3">
        <dashboard-card
          title="นักเรียนที่รอการยืนยัน"
          info="3 คน"
          icon="mdi-account-clock"
        ></dashboard-card>
      </v-col>
      <v-col xs="12" sm="6" lg="3">
        <dashboard-card
          title="นักเรียนที่กำลังศึกษา"
          info="7 คน"
          icon="mdi-book-open-blank-variant"
        ></dashboard-card>
      </v-col>
      <v-col xs="12" sm="6" lg="3">
        <dashboard-card
          title="นักเรียนทั้งหมด"
          info="30 คน"
          icon="mdi-account-group"
        ></dashboard-card>
      </v-col>
    </v-row>

    <v-row class="mt-3">
      <v-col>
        <v-card class="pa-3">
          <v-card-title
            >ข้อมูลนักศึกษาที่สมัครเรียนล่าสุด 10 อันดับแรก</v-card-title
          >
          <v-card-text>
            <v-simple-table class="elevation-2">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">ลำดับ</th>
                    <th class="text-left">ชื่อ-สกุล</th>
                    <th class="text-left">วัน-เวลาที่สมัคร</th>
                    <th class="text-left">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(user, index) in users" :key="user.name">
                    <td>{{ index + 1 }}</td>
                    <td>{{ user.fullname }}</td>
                    <td>{{ user.datetime }}</td>
                    <td>
                      <v-chip
                        class="ma-2"
                        :color="
                          user.status === 'กำลังศึกษา' ? 'info' : 'warning'
                        "
                      >
                        {{ user.status }}
                      </v-chip>
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
import { users } from "./mockUser";
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
      users,
    };
  },
};
</script>
