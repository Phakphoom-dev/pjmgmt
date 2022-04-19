import Vue from "vue";
import VueRouter from "vue-router";

import Layout from "@/components/Layout/Layout";
import FrontLayout from "@/components/Layout/FrontLayout";
// Pages
import Error from "@/views/Error/Error.vue";
import Login from "@/views/Login/Login.vue";
import Dashboard from "@/views/Dashboard/Dashboard.vue";

// User
import User from "@/views/User/User.vue";

// Teacher
import Teacher from "@/views/Teacher/Teacher.vue";

// FileManage
import FileManage from "@/views/FileManage/FileManage.vue";
import TeacherManage from "@/views/FileManage/TeacherManage.vue";
import StudentManage from "@/views/StudentManage/StudentManage.vue";
import Chapter from "@/views/FileManage/Chapter.vue";
import PublishManage from "@/views/PublishManage/PublishManage.vue";

// FrontView
import Index from "@/views/FrontView/Index.vue";
import Collection from "@/views/FrontView/Collection/Collection.vue";
import ViewCollection from "@/views/FrontView/Collection/ViewCollection.vue";

// FileTree
import FileTree from "@/views/FileTree/FileTree.vue";

// ProjectType
import ProjectType from "@/views/ProjectType/ProjectType.vue";

// Report
import Report from "@/views/Report/Report.vue";

// CoverManage
import CoverManage from "@/views/CoverManage/CoverManage.vue";

Vue.use(VueRouter);

// meta 1 = SuperAdmin, 2 = Student
const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/admin",
    name: "Layout",
    component: Layout,
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "/user",
        name: "User",
        component: User,
        meta: [1],
        beforeEnter: (to, from, next) => {
          const user = JSON.parse(localStorage.getItem("userData"));

          let auth = false;
          to.meta.map((role) => {
            if (role === user.roleId) {
              auth = true;
            }
          });
          auth ? next() : next("/404");
        },
      },
      {
        path: "/teacher",
        name: "Teacher",
        component: Teacher,
        meta: [1],
        beforeEnter: (to, from, next) => {
          const user = JSON.parse(localStorage.getItem("userData"));

          let auth = false;
          to.meta.map((role) => {
            if (role === user.roleId) {
              auth = true;
            }
          });
          auth ? next() : next("/404");
        },
      },
      {
        path: "/file-manage",
        name: "FileManage",
        component: FileManage,
        meta: [2, 3],
        beforeEnter: (to, from, next) => {
          const user = JSON.parse(localStorage.getItem("userData"));

          let auth = false;
          to.meta.map((role) => {
            if (role === user.roleId) {
              auth = true;
            }
          });
          auth ? next() : next("/404");
        },
      },
      {
        path: "/chapter/:sFolderId/:stdId/:title",
        name: "Chapter",
        component: Chapter,
        meta: [2, 3],
        beforeEnter: (to, from, next) => {
          const user = JSON.parse(localStorage.getItem("userData"));

          let auth = false;
          to.meta.map((role) => {
            if (role === user.roleId) {
              auth = true;
            }
          });
          auth ? next() : next("/404");
        },
      },
      {
        path: "/file-tree",
        name: "FileTree",
        component: FileTree,
        meta: [1],
        beforeEnter: (to, from, next) => {
          const user = JSON.parse(localStorage.getItem("userData"));

          let auth = false;
          to.meta.map((role) => {
            if (role === user.roleId) {
              auth = true;
            }
          });
          auth ? next() : next("/404");
        },
      },
      {
        path: "/student-manage",
        name: "StudentManage",
        component: StudentManage,
        meta: [1, 3],
        beforeEnter: (to, from, next) => {
          const user = JSON.parse(localStorage.getItem("userData"));

          let auth = false;
          to.meta.map((role) => {
            if (role === user.roleId) {
              auth = true;
            }
          });
          auth ? next() : next("/404");
        },
      },
      {
        path: "/cover-manage",
        name: "CoverManage",
        component: CoverManage,
        meta: [2, 3],
        beforeEnter: (to, from, next) => {
          const user = JSON.parse(localStorage.getItem("userData"));

          let auth = false;
          to.meta.map((role) => {
            if (role === user.roleId) {
              auth = true;
            }
          });
          auth ? next() : next("/404");
        },
      },
      {
        path: "/teacher-manage",
        name: "TeacherManage",
        component: TeacherManage,
        meta: [1, 3],
        beforeEnter: (to, from, next) => {
          const user = JSON.parse(localStorage.getItem("userData"));

          let auth = false;
          to.meta.map((role) => {
            if (role === user.roleId) {
              auth = true;
            }
          });
          auth ? next() : next("/404");
        },
      },
      {
        path: "/publish-manage",
        name: "PublishManage",
        component: PublishManage,
        meta: [1, 3],
        beforeEnter: (to, from, next) => {
          const user = JSON.parse(localStorage.getItem("userData"));

          let auth = false;
          to.meta.map((role) => {
            if (role === user.roleId) {
              auth = true;
            }
          });
          auth ? next() : next("/404");
        },
      },
      {
        path: "/project-type",
        name: "ProjectType",
        component: ProjectType,
        meta: [1, 3],
        beforeEnter: (to, from, next) => {
          const user = JSON.parse(localStorage.getItem("userData"));

          let auth = false;
          to.meta.map((role) => {
            if (role === user.roleId) {
              auth = true;
            }
          });
          auth ? next() : next("/404");
        },
      },
      {
        path: "/report",
        name: "Report",
        component: Report,
        meta: [1, 3],
        beforeEnter: (to, from, next) => {
          const user = JSON.parse(localStorage.getItem("userData"));

          let auth = false;
          to.meta.map((role) => {
            if (role === user.roleId) {
              auth = true;
            }
          });
          auth ? next() : next("/404");
        },
      },
      {
        path: "404",
        name: "404",
        component: Error,
      },
      {
        path: "*",
        redirect: "/404",
      },
    ],
  },
  // Front Route
  {
    path: "/",
    component: FrontLayout,
    children: [
      {
        path: "/index",
        name: "Index",
        component: Index,
      },
      {
        path: "/",
        name: "Collection",
        component: Collection,
      },
      {
        path: "/view-collection",
        name: "ViewCollection",
        component: ViewCollection,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
