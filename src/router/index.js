import Vue from "vue";
import VueRouter from "vue-router";

import Layout from "@/components/Layout/Layout";
import Users from "@/views/Users/Users.vue";
import Teachers from "@/views/Teachers/Teachers.vue";

// Pages
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Error from "@/views/Error/Error.vue";
import Login from "@/views/Login/Login.vue";
import Dashboard from "@/views/Dashboard/Dashboard.vue";
import ShowUsers from "@/views/Users/ShowUsers.vue";
import AddUser from "@/views/Users/AddUser.vue";
import ShowTeachers from "@/views/Teachers/ShowTeachers.vue";
import AddTeacher from "@/views/Teachers/AddTeacher.vue";
import Courses from "@/views/Courses/Courses.vue";
import Subjects from "@/views/Courses/Subjects.vue";
import Lessons from "@/views/Courses/Lessons.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Layout",
    redirect: "login",
    component: Layout,
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "users",
        name: "Users",
        redirect: "users/showusers",
        component: Users,
        children: [
          {
            path: "showusers",
            name: "ShowUsers",
            component: ShowUsers,
          },
          {
            path: "adduser",
            name: "AddUser",
            component: AddUser,
          },
        ],
      },
      {
        path: "teachers",
        name: "Teachers",
        redirect: "teachers/showteachers",
        component: Teachers,
        children: [
          {
            path: "showteachers",
            name: "ShowTeachers",
            component: ShowTeachers,
          },
          {
            path: "addteacher",
            name: "AddTeacher",
            component: AddTeacher,
          },
        ],
      },
      {
        path: "courses",
        name: "Courses",
        component: Courses,
      },
      {
        path: "subjects",
        name: "Subjects",
        component: Subjects,
      },
      {
        path: "lessons",
        name: "Lessons",
        component: Lessons,
      },
      {
        path: "home",
        name: "Home",
        component: Home,
      },
      {
        path: "about",
        name: "About",
        component: About,
      },
      {
        path: "*",
        name: "Error",
        component: Error,
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
