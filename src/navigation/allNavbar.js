export const allNavBar = [
  {
    id: 1,
    title: "ໜ້າຫຼັກ",
    icon: "HiHome",
    role: "CHR",
    details: [
      {
        id: 1,
        title: "ໜ້າຫຼັກ",
        icon: "HiHome",
        role: "CHR",
        path: "/hr/dashboard",
      },
    ],
  },
  {
    id: 2,
    title: "ຈັດການຂໍ້ມູນພະນັກງານ",
    icon: "HiUsers",
    role: "CHR",
    details: [
      {
        id: 21,
        title: "ລົງທະບຽນພະນັກງານໃໝ່",
        icon: "HiUserAdd",
        path: "/hr/register-employee",
      },
      {
        id: 22,
        title: "ພະນັກງານທັ້ງໝົດ",
        icon: "HiClipboardList",
        path: "/hr/all-employees",
      },
      {
        id: 23,
        title: "ຈັດສັນພະນັກງານຝຶກອົບຮົມ",
        icon: "HiAcademicCap",
        path: "/hr/training-assignments",
      },
      {
        id: 24,
        title: "ຈັດການຖານຂໍ້ມູນ",
        icon: "HiDatabase",
        path: "/hr/database-management",
      },
      {
        id: 25,
        title: "ຈັດການຖານສິດທິຜົນປະໂຫຍດ",
        icon: "HiDatabase",
        path: "/hr/benifits-management",
      },
       {
        id: 26,
        title: "ເບີ່ງສິດທິດຜົນປະໂຫຍດ",
        icon: "HiDatabase",
        path: "/hr/get-benifits-management",
      },
    ],
    path: "/hr/employee-management",
  },

  {
    id: 3,
    title: "ຈັດການເງິນເດືອນ",
    icon: "HiHome",
    role: "CHR",
    details: [
      {
        id: 31,
        title: "ຄິດໄລ່ເງິນເດືອນ",
        icon: "FaCalculator",
        path: "/hr/salary-calculation",
      },
      {
        id: 32,
        title: "ບັນທຶກເງິນເດືອນ-OT",
        icon: "FaClock",
        path: "/hr/salary-otcalulation",
      },
      {
        id: 33,
        title: "ບັນທຶກຖານອາກອນເງິນເດືອນ",
        icon: "FaFileInvoiceDollar",
        path: "/hr/tax-data",
      },
      {
        id: 34,
        title: "ບັນທຶກເງິນລ່ວງເວລາ",
        icon: "FaBusinessTime",
        path: "/hr/timeWorkOT",
      },
      {
        id: 35,
        title: "ລາຍການເບີກເງິນແລ້ວ",
        icon: "FaBusinessTime",
        path: "/hr/salary",
      },
    ],
    path: "/hr/salary-management",
  },

  {
    id: 4,
    title: "ຈັດການ kpi & ວັນລາ",
    icon: "HiUsers",
    role: "CHR",
    details: [
      {
        id: 30,
        title: "ອະນຸມັດວັນລາ",
        icon: "HiUserAdd",
        path: "/hr/apprveholiday",
      },
    ],
    path: "/hr/kpi_leave-management",
  },
  {
    id: 5,
    title: "ຕັ້ງຄ່າ",
    icon: "CgProfile",
    role: "CHR",
    path: "/hr/setting",
    details: [
      {
        id: 30,
        title: "ໂປຣໄຟລ",
        icon: "CgProfile",
        path: "/hr/profile ",
      },
    ],
  },
];
