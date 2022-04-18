<template>
  <v-container fluid>
    <v-row>
      <v-col lg="4" sm="6" cols="12">
        <v-card class="mx-1 mb-1">
          <v-card-title class="pa-6 pb-3">
            <p>ยอดการเข้าชมทั้งหมด</p>
            <v-spacer></v-spacer>
            <v-menu>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="textColor">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
            </v-menu>
          </v-card-title>
          <v-card-text class="pa-6 pt-0">
            <v-row no-gutters>
              <v-col cols="6" class="my-auto">
                <span class="" style="font-size: 42px">{{
                  report.totalView
                }}</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col lg="4" sm="6" cols="12">
        <v-card class="mx-1 mb-1">
          <v-card-title class="pa-6 pb-3">
            <p>จำนวนโครงงานทั้งหมด</p>
            <v-spacer></v-spacer>
            <v-menu>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="textColor">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
            </v-menu>
          </v-card-title>
          <v-card-text class="pa-6 pt-0">
            <v-row no-gutters>
              <v-col cols="6" class="my-auto">
                <span class="" style="font-size: 42px">{{
                  report.totalProject
                }}</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col lg="4" sm="6" cols="12">
        <v-card class="mx-1 mb-1">
          <v-card-title class="pa-6 pb-3">
            <p>ยอดการดาวน์โหลดทั้งหมด</p>
            <v-spacer></v-spacer>
            <v-menu>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon color="textColor">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
            </v-menu>
          </v-card-title>
          <v-card-text class="pa-6 pt-0">
            <v-row no-gutters>
              <v-col cols="6" class="my-auto">
                <span class="" style="font-size: 42px">{{
                  report.totalDl
                }}</span>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12"> </v-col>
      <v-col cols="12">
        <v-col cols="12" class="mb-5">
          <h4>กราฟการดาวน์โหลดเอกสารโครงงาน</h4>
          <apexchart
            height="550"
            type="bar"
            :options="graphOptions"
            :series="graphSeries"
          ></apexchart>
        </v-col>

        <v-row>
          <v-col cols="6">
            <h4>โครงงานที่มีการเข้าชมสูงสุด 5 อันดับ</h4>
            <apexchart
              type="bar"
              :options="lineOptions"
              :series="lineSeries"
            ></apexchart>
          </v-col>
          <v-col cols="6">
            <h4>จำนวนโครงงานแต่ละประเภท</h4>
            <apexchart
              type="pie"
              width="550"
              :options="typeChartOptions"
              :series="typeSeries"
            ></apexchart>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import report from "@/api/report";

export default {
  name: "AdminDashboard",
  components: {},
  data() {
    return {
      // Graph
      graphOptions: {
        chart: {
          id: "vuechart-example2",
        },
        xaxis: {
          categories: [],
        },
      },
      graphSeries: [
        {
          name: "series-2",
          data: [],
        },
      ],

      // Donut
      typeSeries: [],
      typeChartOptions: {
        chart: {
          width: 380,
          type: "pie",
        },
        labels: [],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },

      lineOptions: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [],
        },
      },
      lineSeries: [
        {
          name: "series-1",
          data: [],
        },
      ],
      report: {},
    };
  },
  methods: {
    getAdminDashboard() {
      report
        .getAdminReport()
        .then((res) => {
          this.report = res.data;

          this.report.visitReport.map((report) => {
            this.lineOptions.xaxis.categories.push(
              report.projectname.replace(/\.[^/.]+$/, "").substring(0, 20)
            );
            this.lineSeries[0].data.push(report.viewCount);
          });

          this.report.dlReport.map((report) => {
            this.graphOptions.xaxis.categories.push(
              report.sFileName.replace(/\.[^/.]+$/, "").substring(0, 20)
            );
            this.graphSeries[0].data.push(report.dlCount);
          });

          this.report.typeReport.map((report) => {
            this.typeChartOptions.labels.push(report.pTypeName);
            this.typeSeries.push(report.totalType);
          });

          window.dispatchEvent(new Event("resize"));
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getAdminDashboard();
  },
};
</script>
