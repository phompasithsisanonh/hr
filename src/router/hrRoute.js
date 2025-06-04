import AddFileWorkTime from "../components/AddFileWorkTime";
import EditdatabaseEmplyee from "../components/EditdatabaseEmplyee";
import BenefitsForm from "../HRpage/BenefitsForm";
import CalculateSalary from "../HRpage/CalculateSalary";
import CardForSummaryCalu from "../HRpage/CardForSummaryCalu";
import DatabaseSalary from "../HRpage/DatabaseSalary";
import EditDocEmlyee from "../HRpage/EditDocEmlyee";
import HrDashboard from "../HRpage/HrDashboard";
import LeaveRequestList from "../HRpage/LeaveRequestList";
import ListApproveHoliday from "../HRpage/ListApproveHoliday";
import ListBenifis from "../HRpage/ListBenifis";
import ListEmplyees from "../HRpage/ListEmplyees";
import ListSalaryEmplyee from "../HRpage/ListSalaryEmplyee";
import ListTableEmlyee from "../HRpage/ListTableEmlyee";
import Profile from "../HRpage/Profile";
import RegisterEmplyee from "../HRpage/RegisterEmplyee";
import TaxIncomeEm from "../HRpage/TaxIncomeEm";

export const hrRoute = [
  {
    path: "/hr/dashboard",
    element: <HrDashboard />,
    role: "CHR",
  },
  {
    path: "/hr/register-employee",
    element: <RegisterEmplyee />,
    role: "CHR",
  },
  {
    path: "/hr/database-management",
    element: <DatabaseSalary />,
    role: "CHR",
  },
  {
    path: "/editdatabaseEmplyee/:id",
    element: <EditdatabaseEmplyee />,
    role: "CHR",
  },
  {
    path: "/timeWork",
    element: <AddFileWorkTime />,
    role: "CHR",
  },
  {
    path: "/hr/salary-calculation",
    element: <CalculateSalary />,
    role: "CHR",
  },
  {
    path: "/hr/salary-otcalulation",
    element: <CardForSummaryCalu />,
    role: "CHR",
  },
  {
    path: "/hr/tax-data",
    element: <TaxIncomeEm />,
    role: "CHR",
  },
  {
    path: "/hr/timeWorkOT",
    element: <AddFileWorkTime />,
    role: "CHR",
  },
  {
    path: "/hr/salary",
    element: <ListSalaryEmplyee />,
    role: "CHR",
  },
  {
    path: "/hr/calendar/:id",
    element: <LeaveRequestList />,
    role: "CHR",
  },
  {
    path: "/hr/apprveholiday",
    element: <ListApproveHoliday />,
    role: "CHR",
  },
  {
    path: "/hr/detail-employees/:id",
    element: <ListEmplyees />,
    role: "CHR",
  },
  {
    path: "/hr/all-employees",
    element: <ListTableEmlyee />,
    role: "CHR",
  },
  {
    path: "/hr/edit/:id",
    element: <EditDocEmlyee />,
    role: "CHR",
  },
  {
    path: "/hr/profile",
    element: <Profile />,
    role: "CHR",
  },
  {
    path: "/hr/benifits-management",
    element: <BenefitsForm />,
    role: "CHR",
  },
    {
    path: "/hr/get-benifits-management",
    element: <ListBenifis />,
    role: "CHR",
  },
];
