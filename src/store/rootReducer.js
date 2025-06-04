import { combineReducers } from "redux";
import authReducer from "./Reducer/Auth/auth";
import informationReducer from "./Reducer/HRReducer/InformationEmplyee";
import salaryReducer from "./Reducer/HRReducer/salaryReducer";
const rootReducer = combineReducers({
  auth: authReducer,
  information: informationReducer,
  salary: salaryReducer,
});
export default rootReducer;
