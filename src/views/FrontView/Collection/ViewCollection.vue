<template>
  <v-container fluid>
    <Overlay :isLoading="isLoading" />
    <section id="home">
      <v-row justify="center">
        <v-col cols="12">
          <h4 class="mt-3">{{ author.projectname }}</h4>
        </v-col>
      </v-row>

      <v-row class="mt-2" no-gutters>
        <v-col cols="5" class="mr-4">
          <v-img
            max-width="570"
            max-height="356"
            class="mx-auto"
            contain
            :src="
              !author.coverName
                ? require(`@/assets/dt-feu.png`)
                : imgPath('cover', author.coverName)
            "
          ></v-img>
          <div class="mt-2 pink--text">
            <v-icon class="mr-1 pink--text">mdi-eye</v-icon>จำนวนผู้เข้าชม:
            <span class="subtitle">{{ author.viewCount }}</span>
          </div>
        </v-col>

        <v-col cols="6">
          <v-sheet elevation="15">
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td class="yellow border-bottom-10 bor" width="20%">
                      ชื่อโครงงาน
                    </td>
                    <td>{{ author.projectname }}</td>
                  </tr>

                  <tr>
                    <td class="yellow border-bottom-10 bor" width="20%">คณะ</td>
                    <td>{{ author.facultyName }}</td>
                  </tr>

                  <tr>
                    <td class="yellow border-bottom-10 bor" width="20%">
                      สาขา
                    </td>
                    <td>{{ author.branch }}</td>
                  </tr>

                  <tr>
                    <td class="yellow border-bottom-10 bor" width="20%">
                      ชื่อผู้จัดทำ
                    </td>
                    <td>{{ author.fullName }}</td>
                  </tr>

                  <tr>
                    <td class="yellow border-bottom-10 bor" width="20%">
                      ไฟล์เอกสาร
                    </td>
                    <td>
                      <v-row justify="center" class="ma-3">
                        <v-col cols="12" v-if="files.length > 0">
                          <v-expansion-panels
                            v-model="panel"
                            accordion
                            focusable
                          >
                            <v-expansion-panel
                              v-for="folder in folders"
                              :key="folder.sFolderId"
                            >
                              <v-expansion-panel-header>{{
                                folder.title
                              }}</v-expansion-panel-header>
                              <v-expansion-panel-content>
                                <div
                                  v-for="file in files"
                                  :key="file.sFolderId"
                                >
                                  <v-row no-gutters class="mt-1">
                                    <v-col cols="12">
                                      <v-chip
                                        v-if="
                                          file.sFolderId === folder.sFolderId
                                        "
                                        @click="
                                          openPDF(file.sFileName, file.sFileId)
                                        "
                                        class="mt-2"
                                        color="teal darken-1"
                                        label
                                        text-color="white"
                                      >
                                        <v-icon left> mdi-pdf-box </v-icon>
                                        <strong> {{ file.sFileName }} </strong
                                        >&nbsp;
                                      </v-chip>
                                    </v-col>
                                    <v-col>
                                      <span
                                        class="subtitle-2"
                                        v-if="
                                          file.sFolderId === folder.sFolderId
                                        "
                                      >
                                        ยอดดาวน์โหลด : {{ file.dlCount }}
                                      </span>
                                    </v-col>
                                  </v-row>
                                </div>
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-col>
                        <v-col cols="12" v-else>
                          <v-alert border="right" color="blue-grey" dark>
                            ยังไม่มีไฟล์เอกสารที่เผยแพร่
                          </v-alert>
                        </v-col>
                      </v-row>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-sheet>
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<script>
import "@/mixins/generalMixin";
import frontAPI from "@/api/frontend";
import fileAPI from "@/api/file";

export default {
  name: "ViewCollection",
  components: {
    Overlay: () => import("@/components/Overlay"),
  },
  data() {
    return {
      panel: [],
      author: {},
      files: [],
      userData: JSON.parse(localStorage.getItem("userData")),
      isLoading: false,
      folders: [],
    };
  },
  methods: {
    openPDF(filename, sFileId) {
      this.files.find((file) => {
        if (file.sFileId === sFileId) {
          file.dlCount++;
        }
      });

      fileAPI.openPDF(filename);

      // fileAPI
      //   .downloadPDF(filename, sFileId)
      //   .then((res) => {
      //     console.log(res);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    getProject() {
      this.isLoading = true;
      frontAPI
        .getProject({ stdId: this.$route.query.stdId })
        .then((res) => {
          this.isLoading = false;
          console.log(res);
          this.author = res.data.stdFolder[0];
          console.log("author", this.author);
          this.files = res.data.stdFolder;
          this.folders = res.data.folders;

          if (!this.userData) {
            this.folders = this.folders.filter((file) => {
              return file.title === "ปกนอก" || file.title === "บทคัดย่อ";
            });
          }

          console.log(this.folders);

          this.files.map((e, index) => {
            this.panel.push(index);
          });
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
  },
  created() {
    this.getProject();
  },
};
</script>
