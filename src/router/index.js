import Vue from "vue";
import VueRouter from "vue-router";

import Layout from "@/components/Layout/Layout";
import Users from "@/views/Users/Users.vue";
import Teachers from "@/views/Teachers/Teachers.vue";
import Courses from "@/views/Courses/Courses.vue";
import Subjects from "@/views/Subjects/Subjects.vue";
import Lessons from "@/views/Lessons/Lessons.vue";
import Quizs from "@/views/Quizs/Quizs.vue";
import Exams from "@/views/Exams/Exams.vue";
import News from "@/views/News/News.vue";
import Reports from "@/views/Reports/Reports.vue";

// Pages
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
import ShowLessons from "@/views/Lessons/ShowLessons.vue";
import AddLesson from "@/views/Lessons/AddLesson.vue";
import ShowQuizs from "@/views/Quizs/ShowQuizs.vue";
import QuizLesson from "@/views/Quizs/QuizLesson.vue";
import QuizList from "@/views/Quizs/QuizList.vue";
import QuizAdd from "@/views/Quizs/QuizAdd.vue";
import ShowExams from "@/views/Exams/ShowExams.vue";
import ExamQuizs from "@/views/Exams/ExamQuizs.vue";
import ShowNews from "@/views/News/ShowNews.vue";
import ShowReports from "@/views/Reports/ShowReports.vue";
import VisitReport from "@/views/Reports/VisitReport.vue";
import QuizReport from "@/views/Reports/QuizReport.vue";
import ExamReport from "@/views/Reports/ExamReport.vue";

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
    component: Layout,
    children: [
      {
        path: "",
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
        redirect: "lessons/showlessons",
        children: [
          {
            path: "showlessons",
            name: "ShowLessons",
            component: ShowLessons,
          },
          {
            path: "addlesson",
            name: "AddLesson",
            component: AddLesson,
          },
        ],
      },
      {
        path: "quizs",
        name: "Quizs",
        component: Quizs,
        redirect: "quizs/showquizs",
        children: [
          {
            path: "showquizs",
            name: "ShowQuizs",
            component: ShowQuizs,
          },
          {
            path: "quiz-lesson",
            name: "QuizLesson",
            component: QuizLesson,
          },
          {
            path: "quiz-list",
            name: "QuizList",
            component: QuizList,
          },
          {
            path: "quiz-add",
            name: "QuizAdd",
            component: QuizAdd,
          },
        ],
      },
      {
        path: "exams",
        name: "Exams",
        component: Exams,
        redirect: "exams/showexams",
        children: [
          {
            path: "showexams",
            name: "ShowExams",
            component: ShowExams,
          },
          {
            path: "exam-quizs",
            name: "ExamQuizs",
            component: ExamQuizs,
          },
        ],
      },
      {
        path: "news",
        name: "News",
        component: News,
        redirect: "news/shownews",
        children: [
          {
            path: "shownews",
            name: "ShowNews",
            component: ShowNews,
          },
        ],
      },
      {
        path: "reports",
        name: "Reports",
        component: Reports,
        redirect: "reports/showreports",
        children: [
          {
            path: "showreports",
            name: "ShowReports",
            component: ShowReports,
          },
          {
            path: "visitreport",
            name: "VisitReport",
            component: VisitReport,
          },
          {
            path: "quizreport",
            name: "QuizReport",
            component: QuizReport,
          },
          {
            path: "Examreport",
            name: "ExamReport",
            component: ExamReport,
          },
        ],
      },

      {
        path: "about",
        name: "About",
        component: About,
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
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
