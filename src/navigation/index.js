import { allNavBar } from "./allNavbar";

//ເງືອນໄຂ ສ້າງເຂົ້າ
export const getNav = (role) => {
  const finalNavs = [];
  for (let i = 0; i < allNavBar.length; i++) {
    if (role === allNavBar[i].role) {
      finalNavs.push(allNavBar[i]);
    }
  }
  return finalNavs;
};
