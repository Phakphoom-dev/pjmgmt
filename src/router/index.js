import Vue from "vue";
import VueRouter from "vue-router";

import Layout from "@/components/Layout/Layout";
import Users from "@/views/Users/Users.vue";
import Teachers from "@/views/Teachers/Teachers.vue";
import Courses from "@/views/Courses/Courses.vue";
import Subjects from "@/views/Subjects/Subjects.vue";

// Pages
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Error from "@/views/Error/Error.vue";
import Login from "@/views/Login/Login.vue";
import Dashboard from "@/views/Dashboard/Dashboard.vue";
import ShowUsers from "@/views/Users/ShowUsers.vue";
import AddUser from "@/views/Users/AddUser.vue";
import ShowCourses from "@/views/Courses/ShowCourses.vue";
import AddTeacher from "@/views/Teachers/AddTeacher.vue";
import AddCourse from "@/views/Courses/AddCourse.vue";
import ShowTeachers from "@/views/Teachers/ShowTeachers.vue";
import ShowSubjects from "@/views/Subjects/ShowSubjects.vue";
import AddSubject from "@/views/Subjects/AddSubject.vue";

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
        redirect: "courses/showcourses",
        children: [
          {
            path: "showcourses",
            name: "ShowCourses",
            component: ShowCourses,
          },
          {
            path: "addcourse",
            name: "AddCourse",
            component: AddCourse,
          },
        ],
      },
      {
        path: "subjects",
        name: "Subjects",
        component: Subjects,
        redirect: "subjects/showsubjects",
        children: [
          {
            path: "showsubjects",
            name: "ShowSubjects",
            component: ShowSubjects,
          },
          {
            path: "addsubject",
            name: "AddSubject",
            component: AddSubject,
          },
        ],
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
