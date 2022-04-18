<template>
  <v-container class="pa-0" fluid>
    <v-row class="mt-3" justify="center">
      <v-col cols="2">
        <v-select
          hide-details
          solo-inverted
          flat
          :items="projectType"
          item-text="pTypeName"
          item-value="pTypeId"
          label="ประเภทโครงงาน"
          v-model="pTypeId"
          @change="filterByType"
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-text-field
          label="พิมพ์เพื่อค้นหา..."
          append-icon="mdi-magnify"
          flat
          hide-details
          solo-inverted
          style="max-width: 1000px"
          v-model="search"
        />
      </v-col>
    </v-row>

    <v-row class="ml-3 mt-5">
      <v-col>
        <h3>ผลการค้นหาทั้งหมด {{ students.length }} รายการ</h3>
      </v-col>
    </v-row>

    <CollectionSekeleton :isLoading="isLoading" />

    <ProjectSection
      v-for="student in filteredList"
      :key="student.stdId"
      :size="2"
      :value="student"
    />

    <v-row align="center">
      <v-col cols="3">
        <base-btn
          v-if="page !== 1"
          class="ml-0"
          square
          title="Previous page"
          @click="page--"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </base-btn>
      </v-col>

      <v-col class="text-center subheading" cols="6">
        หน้าที่ {{ page }} จาก {{ pages }}
      </v-col>

      <v-col class="text-right" cols="3">
        <base-btn
          v-if="pages > 1 && page < pages"
          class="mr-0"
          square
          title="Next page"
          @click="page++"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </base-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import frontAPI from "@/api/frontend";

export default {
  name: "Index",
  components: {
    // FeedCard: () => import("../Collection/components/Feedcard.vue"),
    ProjectSection: () => import("../Collection/components/ProjectSection.vue"),
    CollectionSekeleton: () =>
      import("@/components/Sekeleton/CollectionSekeleton"),
  },
  data: () => ({
    search: "",
    pTypeId: null,
    projectType: [],
    clone: [],
    layout: [2, 2, 1, 2, 2, 3, 3, 3, 3, 3, 3],
    page: 1,
    students: [],
    isLoading: false,
  }),

  computed: {
    filteredList() {
      return this.students.filter((std) => {
        return std.projectname
          .toLowerCase()
          .includes(this.search.toLowerCase());
      });
    },

    pages() {
      return Math.ceil(this.students.length / 11);
    },

    paginatedArticles() {
      const start = (this.page - 1) * 11;
      const stop = this.page * 11;

      return this.students.slice(start, stop);
    },
  },

  watch: {
    page() {
      window.scrollTo(0, 0);
    },
  },

  methods: {
    filterByType() {
      this.students = this.clone;

      if (this.pTypeId === 0) {
        this.students = this.clone;
      } else {
        this.students = this.students.filter((std) => {
          return std.pTypeId === this.pTypeId;
        });
      }
    },

    getProjects() {
      this.isLoading = true;
      frontAPI
        .getAllProject()
        .then((res) => {
          this.students = res.data.projects;
          this.projectType = res.data.projectType;
          this.projectType.push({
            pTypeId: 0,
            pTypeName: "ทั้งหมด",
          });
          this.projectType.reverse();
          this.clone = this.students;
          this.isLoading = false;
          console.log(this.students);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },

  created() {
    this.getProjects();
  },
};
</script>
