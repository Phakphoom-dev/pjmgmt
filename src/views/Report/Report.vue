<template>
  <v-container fluid class="mt-3">
    <h3>จัดการรายงาน</h3>

    <v-row class="mt-3">
      <v-col cols="12">
        <v-btn
          :color="type === 'typeReport' ? 'primary' : ''"
          @click="type = 'typeReport'"
          >รายงานประเภทโครงงาน</v-btn
        >
        <v-btn
          class="ml-2"
          :color="type === 'visitReport' ? 'primary' : ''"
          @click="type = 'visitReport'"
          >รายงานการเข้าชมเอกสาร</v-btn
        >
        <v-btn
          class="ml-2"
          :color="type === 'dlReport' ? 'primary' : ''"
          @click="type = 'dlReport'"
          >รายงานการยอดการดาวน์โหลด</v-btn
        >
      </v-col>
      <v-col>
        <!-- DataTable -->
        <v-data-table
          :loading="isLoading"
          :headers="headers"
          :items="items"
          class="elevation-1"
          :search="search"
          :sort-by="type === 'dlReport' ? 'dlCount' : ''"
          sort-desc
          :footer-props="{
            showFirstLastPage: true,
            'items-per-page-text': 'รายการต่อหน้า',
          }"
          no-results-text="ไม่พบข้อมูล"
        >
          <!-- Datatable Header -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>รายงานประเภทโครงงาน</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="ค้นหารายงาน"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>
          <!-- Datatable /Header -->

          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <template v-slot:item.coverImg="{ item }">
            <div class="ma-3">
              <v-img
                contain
                max-height="200"
                max-width="200"
                :src="imgPath('cover', item.coverName)"
              ></v-img>
            </div>
          </template>

          <template v-slot:loading> กำลังโหลดข้อมูล... </template>
          <template v-slot:no-data> ไม่พบข้อมูล </template>
        </v-data-table>
        <!-- /DataTable -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
import report from "@/api/report";
import { typeReportHeader, visitReportHeader, dlReportHeader } from "./header";

export default {
  name: "Report",
  components: {},
  data() {
    return {
      visitReportHeader,
      typeReportHeader,
      isLoading: false,
      search: "",
      type: "",
      typeReport: [],
      items: [],
      headers: [],
      reports: [],
    };
  },

  watch: {
    type(val, newVal) {
      console.log(val, newVal);

      if (val === "typeReport") {
        this.headers = typeReportHeader;
        this.items = this.reports.typeReport;
      }

      if (val === "visitReport") {
        this.headers = visitReportHeader;
        this.items = this.reports.visitReport;
      }

      if (val === "dlReport") {
        this.headers = dlReportHeader;
        this.items = this.reports.dlReport;
      }
    },
  },

  methods: {
    getData() {
      this.isLoading = true;
      report
        .getReport()
        .then((res) => {
          this.isLoading = false;
          this.typeReport = res.data.typeReport;
          this.type = "typeReport";
          this.reports = res.data;
          this.headers = this.typeReportHeader;
          console.log(res);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },
  async created() {
    this.getData();
  },
};
</script>
