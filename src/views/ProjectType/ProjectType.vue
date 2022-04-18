<template>
  <v-container fluid class="mt-3">
    <h3>จัดการประเภทโครงงาน</h3>
    <v-row class="mt-3">
      <v-col>
        <!-- DataTable -->
        <v-data-table
          :loading="isLoading"
          :headers="pTypeHeader"
          :items="pType"
          class="elevation-1"
          :search="search"
          :footer-props="{
            showFirstLastPage: true,
            'items-per-page-text': 'รายการต่อหน้า',
          }"
          no-results-text="ไม่พบข้อมูล"
        >
          <!-- Datatable Header -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>จัดการประเภทโครงงาน</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="ค้นหาประเภทโครงงาน"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2" @click="openAddModal">
                เพิ่มประเภทโครงงาน
              </v-btn>
            </v-toolbar>
          </template>
          <!-- Datatable /Header -->

          <template slot="item.index" scope="props">
            {{ props.index + 1 }}
          </template>

          <!-- Action -->
          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="editProjectType(item)" color="info">
              mdi-pencil
            </v-icon>
            <v-icon @click="deletePType(item)" color="error">
              mdi-delete
            </v-icon>
          </template>
          <!-- /Action -->

          <template v-slot:loading> กำลังโหลดข้อมูล... </template>
          <template v-slot:no-data> ไม่พบข้อมูล </template>
        </v-data-table>
        <!-- /DataTable -->
      </v-col>
    </v-row>

    <!-- Dialog -->
    <EditProjectType
      :resetValid="resetValid"
      :dialog="editDialog"
      :action="action"
      :projectType="projectType"
      @getType="getType"
      @close="close"
    />
    <!-- /Dialog -->

    <!-- Delete Modal -->
    <DeleteDialog
      :showDelete="showDelete"
      @closeDelete="showDelete = false"
      @confirmDelete="deleteProjectType"
    />
    <!-- /Delete Modal -->
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
import pTypeAPI from "@/api/pType";
import { pTypeHeader } from "./projectType";
import EditProjectType from "./components/EditProjectType.vue";
import DeleteDialog from "@/components/DeleteDialog";

export default {
  name: "ProjectType",
  components: {
    EditProjectType,
    DeleteDialog,
  },

  data() {
    return {
      showDelete: false,
      editDialog: false,
      search: "",
      pTypeHeader,
      isLoading: true,
      pType: [],
      projectType: {},
      action: "",
      resetValid: false,
      deleteData: {},
    };
  },

  methods: {
    deletePType(type) {
      this.deleteData = type;
      this.showDelete = true;
      console.log("deleteData", this.deleteData);
    },

    deleteProjectType() {
      let formData = new FormData();
      formData.append("pTypeId", this.deleteData.pTypeId);

      pTypeAPI
        .deleteProjectType(formData)
        .then((res) => {
          this.isLoading = false;
          this.$toast.open({
            type: "success",
            message: res.data.message,
          });
          this.showDelete = false;
          this.getType();
        })
        .catch((err) => {
          this.isLoading = false;
          this.showDelete = false;
          this.$toast.open({
            type: "warning",
            message: err.response.data.message,
          });
          console.log(err);
        });
      this.isLoading = true;
    },

    editProjectType(type) {
      this.action = "edit";
      this.editDialog = true;
      this.projectType = type;
    },

    close() {
      this.editDialog = false;
      this.projectType = {};
      this.resetValid = false;
      this.getType();
    },

    openAddModal() {
      this.action = "add";
      this.editDialog = true;
      this.resetValid = true;
    },

    getType() {
      this.isLoading = true;

      pTypeAPI
        .getProjectType()
        .then((res) => {
          this.isLoading = false;
          this.pType = res.data.pType;
          console.log("pType", this.pType);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },
  async created() {
    this.getType();
  },
};
</script>
