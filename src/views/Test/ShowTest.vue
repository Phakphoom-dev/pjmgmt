<template>
  <v-container fluid class="mt-3">
    <v-row class="mt-2" no-gutters>
      <h3>แบบทดสอบ</h3>
    </v-row>

    <!-- <v-row>
      <v-col>
        <v-btn color="secondary" to="subjects">จัดการหลักสูตร</v-btn>
        <v-btn color="primary" class="ml-2" to="subjects/subjects"
          >จัดการรายวิชา</v-btn
        >
        <v-btn color="secondary" class="ml-2">จัดการบทเรียน</v-btn>
      </v-col>
    </v-row> -->

    <v-row class="mt-3">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="subjects"
          sort-by="username"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>จัดการแบบทดสอบ</v-toolbar-title>
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

          <template v-slot:item.active="{ item }">
            <div>
              <v-switch
                v-model="item.active"
                color="success"
                :error="!item.active"
                dense
              ></v-switch>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="editItem(item)" color="info">
              mdi-pencil
            </v-icon>
          </template>
          <template v-slot:no-data> ไม่พบหลักสูตร </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ShowQuizs",
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ลำดับที่", value: "index" },
      { text: "รายวิชา", value: "subjectName" },
      { text: "จำนวนบทเรียน", value: "lessonAmount" },
      { text: "จัดการ", value: "actions", sortable: false },
    ],
    subjects: [],
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
    async getData() {
      this.subjects = await this.get("/subject/getAllSubject.php");
      console.log(this.subjects);
    },

    editItem(item) {
      console.log(item);
      this.$router.push({
        name: "TestList",
        query: {
          subjectId: item.subjectId,
          subjectName: item.subjectName,
        },
      });
    },

    deleteItem(item) {
      this.editedIndex = this.subjects.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.subjects.splice(this.editedIndex, 1);
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
        Object.assign(this.subjects[this.editedIndex], this.editedItem);
      } else {
        this.subjects.push(this.editedItem);
      }
      this.close();
    },
  },

  created() {
    this.getData();
  },
};
</script>
