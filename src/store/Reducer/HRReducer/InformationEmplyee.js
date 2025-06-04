import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../API/api";
/// post data
export const addDataEmplyee = createAsyncThunk(
  "information/addDataEmplyee",
  async (dataToSubmit, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/informationEmplyee/addDataEmplyee",
        {
          otTohour: dataToSubmit.otTohour,
          otminute: dataToSubmit.otminute,
          typeCommission: dataToSubmit.typeCommission,
          setAnnualHolidays: dataToSubmit.setAnnualHolidays,
          typeOfSecurity: dataToSubmit.typeOfSecurity,
        },
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
// get all
export const DataEmplyee = createAsyncThunk(
  "information/data",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/informationEmplyee/dataEM", {
        withCredentials: true,
      });
      console.log("data", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
///get id
export const editOneidDataEmplyee = createAsyncThunk(
  "information/editOneIddata",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    console.log(id);
    try {
      const { data } = await api.get(
        `/informationEmplyee/editdatabase/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
// Action สำหรับส่งข้อมูลพนักงาน
export const registerEmployee = createAsyncThunk(
  "information/registerEmployee",
  async (formData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/informationEmplyee/registerEmplyee",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
//edit_data
export const edit_data = createAsyncThunk(
  "information/edit_data",
  async (employeeData, { rejectWithValue, fulfillWithValue }) => {
    console.log(employeeData);
    try {
      const { data } = await api.post(
        `/informationEmplyee/edit_data/${employeeData.id}`,
        {
          otTohour: employeeData.otTohour,
          otminute: employeeData.otminute,
          latTohour: employeeData.latTohour,
          latminute: employeeData.latminute,
          startWorkTime: employeeData.startWorkTime,
          standardTimeWorkHour: employeeData.standardTimeWorkHour,
          typeCommission: employeeData.typeCommission,
          setAnnualHolidays: employeeData.setAnnualHolidays,
          typeOfSecurity: employeeData.typeOfSecurity,
          department: employeeData.department,
          contentsOfHolidays: employeeData.contentsOfHolidays,
        },
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
///edit deparment hr
export const edit_deparmentPosition = createAsyncThunk(
  "information/edit_deparmentPosition ",
  async (
    { id, editedPosition, type },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.post(
        `/informationEmplyee/edit_deparmentPosition/${id}`,
        {
          editedPosition,
          type,
        },
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
// getleave
export const getleave = createAsyncThunk(
  "information/getleave",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/informationEmplyee/getLeave", {
        withCredentials: true,
      });
      console.log("data", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
// postleave
export const postleave = createAsyncThunk(
  "information/postleave",
  async ({ leaveId, status }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/informationEmplyee/statusAllow/${leaveId}`,
        {
          status: status,
        },
        {
          withCredentials: true,
        }
      );
      console.log("data", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
// getleaveId
export const getleaveId = createAsyncThunk(
  "information/getleaveId",
  async ({ idOne }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/informationEmplyee/getLeaveId/${idOne}`,
        {
          withCredentials: true,
        }
      );
      console.log("data", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//getIdEmlyee
export const getIdEmlyee = createAsyncThunk(
  "information/getIdEmlyee",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/informationEmplyee/getIdEmlyee/${id}`, {
        withCredentials: true,
      });
      console.log("data", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
// edit สำหรับส่งข้อมูลพนักงาน
export const editEmployee = createAsyncThunk(
  "information/editEmployee",
  async ({ formData, id }, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log("formData", formData);
      const { data } = await api.patch(
        `/informationEmplyee/editEmployee/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
// block_active
export const block_active = createAsyncThunk(
  "information/block_active",
  async ({ active, id }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.patch(
        `/block_active/${id}`,
        { isActive: active },
        {
          withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
// delete typeOfSecurity
export const typeOfSecurity = createAsyncThunk(
  "information/typeOfSecurity",
  async ({ settingId, index }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(
        `/informationEmplyee/settings/${settingId}/typeOfSecurity/${index}`,
        {
          withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
// delete deletedatabaseholidays
export const deletedatabaseholidays = createAsyncThunk(
  "information/deletedatabaseholidays",
  async ({ settingId, index }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(
        `/informationEmplyee/settings/${settingId}/deletedatabaseholidays/${index}`,
        {
          withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
//getDepartment
export const getDepartment = createAsyncThunk(
  "information/getDepartment ",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/informationEmplyee/getDepartment`, {
        withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
//benifits-FORM
export const benifits = createAsyncThunk(
  "information/benifits",
  async ({ formData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      const { data } = await api.post(
        `/informationEmplyee/benifits`,

        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

///getBenifits
export const getBenifits = createAsyncThunk(
  "information/getBenifits",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/informationEmplyee/getBenifits`, {
        withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
//getBenifitsId
export const getBenifitsId = createAsyncThunk(
  "information/getBenifitsId",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/informationEmplyee/getBenifitsId/${id}`,
        {
          withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
        }
      );
      console.log("data", data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
//editBenefit
export const editBenefit = createAsyncThunk(
  "information/editBenefit",
  async ({ id, formData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const { data } = await api.patch(
        `/informationEmplyee/editBenefit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
//deleteBenefit

export const deleteBenefit = createAsyncThunk(
  "information/deleteBenefit",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(
        `/informationEmplyee/deleteBenefit/${id}`,
        {
          withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
///addBenifitEmplyee
export const addBenifitEmplyee = createAsyncThunk(
  "information/addBenifitEmplyee",
  async ({ items }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/informationEmplyee/addBenifitEmplyee`,
        {
          code: items.selectedEmployee,
          item: items.item,
        },
        {
          withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);
export const informationReducer = createSlice({
  name: "information",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: true,
    getdatabase: [],
    editDataOneid: [],
    getleavris: [],
    getIdEmlyries: [],
    getleaveIdreis: [],
    getDepartmentries: [],
    getBenifitsData: [],
    getBenifitsIds: {},
    pdfUrl: "",
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDataEmplyee.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(addDataEmplyee.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(addDataEmplyee.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(DataEmplyee.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.getdatabase = payload.data;
      })
      // registerEmployee
      .addCase(registerEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.getdatabase.push(action.payload); // เพิ่มข้อมูลใหม่
      })
      .addCase(registerEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(editOneidDataEmplyee.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.editDataOneid = payload.data;
      })
      .addCase(edit_data.pending, (state) => {
        state.loader = true;
      })
      .addCase(edit_data.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(edit_data.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      ///edit deparment_position
      .addCase(edit_deparmentPosition.pending, (state) => {
        state.loader = true;
      })
      .addCase(edit_deparmentPosition.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(edit_deparmentPosition.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      //getleave
      .addCase(getleave.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.getleavris = payload.data;
      })
      //postleave
      ///edit deparment_position
      .addCase(postleave.pending, (state) => {
        state.loader = true;
      })
      .addCase(postleave.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(postleave.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      //getIdEmlyee
      .addCase(getIdEmlyee.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.getIdEmlyries = payload.data;
      })
      // editEmployee
      .addCase(editEmployee.pending, (state) => {
        state.loader = true;
      })
      .addCase(editEmployee.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(editEmployee.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      //getleaveId
      .addCase(getleaveId.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.getleaveIdreis = payload.data;
      })
      ///block_active
      .addCase(block_active.pending, (state) => {
        state.loader = true;
      })
      .addCase(block_active.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(block_active.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      //typeOfSecurity
      .addCase(typeOfSecurity.pending, (state) => {
        state.loader = true;
      })
      .addCase(typeOfSecurity.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(typeOfSecurity.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      //deletedatabaseholidays
      .addCase(deletedatabaseholidays.pending, (state) => {
        state.loader = true;
      })
      .addCase(deletedatabaseholidays.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(deletedatabaseholidays.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })

      //getDepartment
      .addCase(getDepartment.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.getDepartmentries = payload.data;
      })
      //benifits
      .addCase(benifits.pending, (state) => {
        state.loader = true;
      })
      .addCase(benifits.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(benifits.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      //getBenifits
      .addCase(getBenifits.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.getBenifitsData = payload.data;
      })
      //getBenifitsId

      .addCase(getBenifitsId.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.getBenifitsIds = payload.data;
        state.pdfUrl = payload.pdfUrl;
      })
      //editBenefit
      .addCase(editBenefit.pending, (state) => {
        state.loader = true;
      })
      .addCase(editBenefit.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(editBenefit.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      //deleteBenefit
      .addCase(deleteBenefit.pending, (state) => {
        state.loader = true;
      })
      .addCase(deleteBenefit.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(deleteBenefit.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      //addBennitif
      .addCase(addBenifitEmplyee.pending, (state) => {
        state.loader = true;
      })
      .addCase(addBenifitEmplyee.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(addBenifitEmplyee.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      });
  },
});

export const { messageClear } = informationReducer.actions;
export default informationReducer.reducer;
