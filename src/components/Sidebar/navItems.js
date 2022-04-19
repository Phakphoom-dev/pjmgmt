export const adminNav = [
  { title: "หน้าหลัก", icon: "mdi-home", link: "/dashboard" },
  {
    title: "จัดการข้อมูลอาจารย์",
    icon: "mdi-account-tie",
    link: "/teacher",
  },
  {
    title: "จัดการข้อมูลนักศึกษา",
    icon: "mdi-school",
    link: "/user",
  },
  {
    title: "จัดการโครงสร้างเอกสาร",
    icon: "mdi-family-tree",
    link: "/file-tree",
  },
  {
    title: "จัดการประเภทโครงงาน",
    icon: "mdi-file-document-multiple-outline",
    link: "/project-type",
  },
  {
    title: "รายงาน",
    icon: "mdi-chart-timeline",
    link: "/report",
  },
];

export const userNav = [
  { title: "จัดการโครงงาน", icon: "mdi-file-document", link: "/file-manage" },
  { title: "ค้นหาโครงงาน", icon: "mdi-magnify", link: "/" },
  { title: "จัดการรูปภาพหน้าปก", icon: "mdi-cast-education", link: "/cover-manage" },
];

export const teacherNav = [
  { title: "หน้าหลัก", icon: "mdi-home", link: "/dashboard" },
  { title: "จัดการโครงงานนักศึกษา", icon: "mdi-file-document", link: "/student-manage" },
  { title: "จัดการสถานะการเผยแพร่", icon: "mdi-printer-settings", link: "/publish-manage" },
  { title: "ค้นหาโครงงาน", icon: "mdi-magnify", link: "/" },
];
