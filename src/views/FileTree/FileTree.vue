<template>
  <v-container fluid class="mt-3">
    <h3>จัดการโครงสร้างเอกสารโครงงาน</h3>
    <!-- folderDialog -->
    <v-row class="mt-3 text-subtitle-2">
      <v-col cols="auto">
        <v-switch v-model="enabled" label="ปรับตำแหน่งเอกสาร"></v-switch>
      </v-col>
      <v-col cols="auto" class="ml-auto"> </v-col>
    </v-row>

    <v-card max-width="1000" class="mx-auto">
      <v-toolbar color="light-blue" dark>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>โครงสร้างเอกสารโครงงาน</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn
          color="indigo lighten-1"
          class="ma-2 white--text"
          @click="openAddModal"
        >
          เพิ่มเอกสาร
          <v-icon right dark> mdi-folder </v-icon>
        </v-btn>
      </v-toolbar>

      <v-list subheader two-line>
        <v-subheader inset>บทโครงงาน</v-subheader>

        <draggable
          :list="folders"
          :disabled="!enabled"
          class="list-group"
          ghost-class="ghost"
          :move="checkMove"
          @start="dragging = true"
          @end="updatePosition"
        >
          <v-list-item v-for="folder in folders" :key="folder.title">
            <v-list-item-avatar>
              <v-icon class="grey lighten-1" dark> mdi-folder </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="folder.title"></v-list-item-title>

              <v-list-item-subtitle
                v-text="folder.subtitle"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-row>
                <v-btn class="ma-2" color="warning" @click="editFolder(folder)">
                  <v-icon left> mdi-book-edit </v-icon>
                  แก้ไข
                </v-btn>
                <v-btn class="ma-2" color="error" @click="delFolder(folder)">
                  <v-icon left> mdi-delete </v-icon>
                  ลบ
                </v-btn>
              </v-row>
            </v-list-item-action>
          </v-list-item>
        </draggable>
      </v-list>
    </v-card>
    <!-- /folderDialog -->

    <!-- AddFolder Modal -->
    <AddFolder
      :addDialog="addDialog"
      :folder="folder"
      @close="close"
      @open="addDialog = true"
      @getFolders="getFolders"
      :action="action"
      :resetValid="resetValid"
    />
    <!-- /AddFolder Modal -->

    <!-- Delete Modal -->
    <DeleteDialog
      :showDelete="showDelete"
      @closeDelete="showDelete = false"
      @confirmDelete="confirmDelete"
    />
    <!-- /Delete Modal -->
  </v-container>
</template>

<script>
import DeleteDialog from "@/components/DeleteDialog";
import AddFolder from "./components/AddFolder.vue";
import draggable from "vuedraggable";
import fileAPI from "@/api/file";
import "@/mixins/generalMixin";

export default {
  name: "FileTree",
  components: {
    draggable,
    AddFolder,
    DeleteDialog,
  },
  data() {
    return {
      showDelete: false,
      resetValid: false,
      action: "",
      addDialog: false,
      enabled: false,
      userData: JSON.parse(localStorage.getItem("userData")),
      folders: [],
      folder: {},
      deleteData: {},
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    },
  },
  methods: {
    confirmDelete() {
      let formData = JSON.stringify(this.deleteData);
      fileAPI
        .deleteFolder(formData)
        .then((res) => {
          this.isLoading = false;
          this.$toast.open({
            type: "success",
            message: res.data.message,
          });
          this.showDelete = false;
          this.getFolders();
        })
        .catch((err) => {
          this.isLoading = false;
          this.$toast.open({
            type: "error",
            message: err.response.data.message,
          });
          console.log(err);
        });
    },
    delFolder(folder) {
      this.deleteData = folder;
      this.showDelete = true;
    },
    editFolder(folder) {
      this.action = "edit";
      this.addDialog = true;
      this.folder = folder;
      this.folder.fsName = folder.title;
      this.folder.fsDetail = folder.subtitle;
    },
    updatePosition() {
      this.dragging = false;
      let formData = JSON.stringify(this.folders);

      fileAPI
        .switchFolder(formData)
        .then((res) => {
          this.isLoading = false;
          console.log(res);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
    openAddModal() {
      this.action = "add";
      this.addDialog = true;
      this.resetValid = true;
    },
    close() {
      this.addDialog = false;
      this.folder = {};
    },
    add: function () {
      console.log("add");
    },
    replace: function () {
      console.log("replace");
    },
    checkMove: function (e) {},
    getFolders() {
      this.isLoading = true;
      fileAPI
        .getFolder()
        .then((res) => {
          this.isLoading = false;
          this.folders = res.data.folders;
          console.log("folder", this.folders);
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },
  async created() {
    this.getFolders();
  },
};
</script>
