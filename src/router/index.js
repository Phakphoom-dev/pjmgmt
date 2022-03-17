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
import Students from "@/views/Students/Students.vue";
import Videos from "@/views/Videos/Videos.vue";
import Test from "@/views/Test/Test.vue";

// Pages
import Error from "@/views/Error/Error.vue";
import Login from "@/views/Login/Login.vue";
import Dashboard from "@/views/Dashboard/Dashboard.vue";
import ShowUsers from "@/views/Users/ShowUsers.vue";
import EditUser from "@/views/Users/EditUser.vue";
import AddUser from "@/views/Users/AddUser.vue";
import EditTeacher from "@/views/Teachers/EditTeacher.vue";
import ShowCourses from "@/views/Courses/ShowCourses.vue";
import AddTeacher from "@/views/Teachers/AddTeacher.vue";
import AddCourse from "@/views/Courses/AddCourse.vue";
import EditCourse from "@/views/Courses/EditCourse.vue";
import ShowTeachers from "@/views/Teachers/ShowTeachers.vue";
import ShowSubjects from "@/views/Subjects/ShowSubjects.vue";
import RegisterSubject from "@/views/Subjects/RegisterSubject.vue";
import AddSubject from "@/views/Subjects/AddSubject.vue";
import EditSubject from "@/views/Subjects/EditSubject.vue";
import ShowLessons from "@/views/Lessons/ShowLessons.vue";
import EditLesson from "@/views/Lessons/EditLesson.vue";
import AddLesson from "@/views/Lessons/AddLesson.vue";
import ShowQuizs from "@/views/Quizs/ShowQuizs.vue";
import ShowTest from "@/views/Test/ShowTest.vue";
import TestList from "@/views/Test/TestList.vue";
import QuizLesson from "@/views/Quizs/QuizLesson.vue";
import QuizList from "@/views/Quizs/QuizList.vue";
import QuizAdd from "@/views/Quizs/QuizAdd.vue";
import QuizEdit from "@/views/Quizs/QuizEdit.vue";
import ShowExams from "@/views/Exams/ShowExams.vue";
import ExamQuizs from "@/views/Exams/ExamQuizs.vue";
import ShowNews from "@/views/News/ShowNews.vue";
import ShowReports from "@/views/Reports/ShowReports.vue";
import VisitReport from "@/views/Reports/VisitReport.vue";
import QuizReport from "@/views/Reports/QuizReport.vue";
import SubjectReport from "@/views/Reports/SubjectReport.vue";
import ExamReport from "@/views/Reports/ExamReport.vue";
import ShowStudents from "@/views/Students/ShowStudents.vue";
import StudentLog from "@/views/Students/StudentLog.vue";
import AddStudent from "@/views/Students/AddStudent.vue";
import EditStudent from "@/views/Students/EditStudent.vue";
import ShowVideos from "@/views/Videos/ShowVideos.vue";
import Contact from "@/views/Contact/Contact.vue";
import About from "@/views/About/About.vue";
import ShowSettings from "@/views/Settings/ShowSettings.vue";
import Settings from "@/views/Settings/Settings.vue";
import AddSlide from "@/views/Settings/AddSlide.vue";
import EditSlide from "@/views/Settings/EditSlide.vue";
import SuperSettings from "@/views/SuperSettings/SuperSettings.vue";
import SuperSettingsIndex from "@/views/SuperSettings/SuperSettingsIndex.vue";
import SubjectLesson from "@/views/Lessons/SubjectLesson.vue";
import StudentSubject from "@/views/Students/StudentSubject.vue";
import EditStudentSubject from "@/views/Students/EditStudentSubject.vue";
import LessonList from "@/views/Reports/LessonList.vue";
import ViewScore from "@/views/Reports/ViewScore.vue";
import ViewExamScore from "@/views/Reports/ViewExamScore.vue";

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
        path: "settings",
        name: "Settings",
        redirect: "settings/showsettings",
        component: Settings,
        children: [
          {
            path: "showsettings",
            name: "ShowSettings",
            component: ShowSettings,
          },
          {
            path: "add-slide",
            name: "AddSlide",
            component: AddSlide,
          },
          {
            path: "edit-slide",
            name: "EditSlide",
            component: EditSlide,
          },
        ],
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
          {
            path: "edituser",
            name: "EditUser",
            component: EditUser,
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
          {
            path: "edit-teacher",
            name: "EditTeacher",
            component: EditTeacher,
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
          {
            path: "edit-course",
            name: "EditCourse",
            component: EditCourse,
          },
        ],
      },
      {
        path: "contact",
        name: "Contact",
        component: Contact,
      },
      {
        path: "about",
        name: "About",
        component: About,
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
          {
            path: "edit-subject",
            name: "EditSubject",
            component: EditSubject,
          },
          {
            path: "register-subject",
            name: "RegisterSubject",
            component: RegisterSubject,
          },
        ],
      },
      {
        path: "lessons",
        name: "Lessons",
        component: Lessons,
        redirect: "lessons/subject-lesson",
        children: [
          {
            path: "subject-lesson",
            name: "SubjectLesson",
            component: SubjectLesson,
          },
          {
            path: "showlessons",
            name: "ShowLessons",
            component: ShowLessons,
            beforeEnter: (to, from, next) => {
              if (!to.query.subjectId) {
                next("/lessons/subject-lesson");
              }
              next();
            },
          },
          {
            path: "addlesson",
            name: "AddLesson",
            component: AddLesson,
          },
          {
            path: "edit-lesson",
            name: "EditLesson",
            component: EditLesson,
          },
        ],
      },
      {
        path: "super-settings",
        name: "SuperSettings",
        component: SuperSettings,
        redirect: "super-settings/index",
        children: [
          {
            path: "index",
            name: "SuperSettingsIndex",
            component: SuperSettingsIndex,
          },
        ],
      },
      {
        path: "test",
        name: "Test",
        component: Test,
        redirect: "test/showtest",
        children: [
          {
            path: "showtest",
            name: "ShowTest",
            component: ShowTest,
          },
          {
            path: "test-list",
            name: "TestList",
            component: TestList,
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
          {
            path: "quiz-edit",
            name: "QuizEdit",
            component: QuizEdit,
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
            path: "subjectreport",
            name: "SubjectReport",
            component: SubjectReport,
          },
          {
            path: "lessonList",
            name: "LessonList",
            component: LessonList,
          },
          {
            path: "viewscore",
            name: "ViewScore",
            component: ViewScore,
          },
          {
            path: "viewexamscore",
            name: "ViewExamScore",
            component: ViewExamScore,
          },
          {
            path: "Examreport",
            name: "ExamReport",
            component: ExamReport,
          },
        ],
      },
      {
        path: "students",
        name: "Students",
        component: Students,
        redirect: "students/showstudents",
        children: [
          {
            path: "showstudents",
            name: "ShowStudents",
            component: ShowStudents,
          },
          {
            path: "student-subject",
            name: "StudentSubject",
            component: StudentSubject,
          },
          {
            path: "edit-student-subject",
            name: "EditStudentSubject",
            component: EditStudentSubject,
          },
          {
            path: "addstudent",
            name: "AddStudent",
            component: AddStudent,
          },
          {
            path: "edit-student",
            name: "EditStudent",
            component: EditStudent,
          },
          {
            path: "student-log",
            name: "StudentLog",
            component: StudentLog,
          },
        ],
      },
      {
        path: "videos",
        name: "Videos",
        component: Videos,
        redirect: "videos/show-videos",
        children: [
          {
            path: "show-videos",
            name: "ShowVideos",
            component: ShowVideos,
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
